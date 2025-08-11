<?php

namespace wusong8899\WelfareTicket\Console;

use wusong8899\WelfareTicket\Model\WelfareTicket;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;
use wusong8899\WelfareTicket\Notification\WelfareTicketBlueprint;

use Flarum\Console\AbstractCommand;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Bus\Dispatcher;
use Symfony\Contracts\Translation\TranslatorInterface;
use Illuminate\Support\Arr;
use Flarum\User\User;
use Flarum\Notification\NotificationSyncer;
use Illuminate\Support\Carbon;

class WelfareTicketScheduleCommand extends AbstractCommand
{
    protected $bus;
    protected $settings;
    protected $translator;
    protected $notifications;

    public function __construct(NotificationSyncer $notifications, Dispatcher $bus, SettingsRepositoryInterface $settings, TranslatorInterface $translator)
    {
        parent::__construct();
        $this->bus = $bus;
        $this->settings = $settings;
        $this->translator = $translator;
        $this->notifications = $notifications;
    }

    protected function configure()
    {
        $this->setName('welfareTicket:syncData')->setDescription('Sync data');
    }

    protected function fire()
    {
        $defaultTimezone = 'Asia/Shanghai';
        $settingTimezone = $this->settings->get('wusong8899-welfare-ticket.welfareTimezone', $defaultTimezone);

        if (!in_array($settingTimezone, timezone_identifiers_list())) {
            $settingTimezone = $defaultTimezone;
        }

        $serverDate = Carbon::now($settingTimezone);
        $serverDateArray = $serverDate->toArray();
        $serverDateHour = $serverDateArray["hour"];

        if ($serverDateHour == 21) {
            $welfareTicketFirstData = WelfareTicket::where([['activated', '!=', 2], ['result', '=', null]])->orderBy('id', 'asc')->first();

            if (isset($welfareTicketFirstData)) {
                $welfareTicketFirstData->activated = 0;
                $welfareTicketFirstData->save();
            }
        } else {
            // $this->info('Sync starting...');

            $type = 1;
            $ch = curl_init();
            $url = "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=3d&issueCount=&issueStart=&issueEnd=&dayStart=&dayEnd=&pageNo=1&pageSize=30&week=&systemType=PC";
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0');
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
            curl_setopt($ch, CURLOPT_TIMEOUT, 120);
            curl_setopt($ch, CURLOPT_COOKIE, "HMF_CI=113241");
            $result = json_decode(curl_exec($ch));

            $data = $result->result[0];
            $code = intval($data->code);
            $welfareTickeID = $type . "" . $code;
            $date = $data->date;
            $red = $data->red;
            $sales = $data->sales;

            // app("log")->error($welfareTickeID."#".$date."#".$red."#".$sales);
            // app("log")->error(json_encode($result->result[0]));
            // app("log")->error($welfareTickeID);

            $welfareTicketData = WelfareTicket::find($welfareTickeID);

            if (isset($welfareTicketData) && !isset($welfareTicketData->result)) {
                $redResult = explode(",", $red);
                $welfareTicketSettings = json_decode($welfareTicketData->settings);
                $welfareTicketDealerBet = round($welfareTicketSettings->dealerBet, 2);
                $welfareTicketDealerBetCut = intval($welfareTicketSettings->dealerBetCut);
                $welfareTicketWin1Multiplier = round($welfareTicketSettings->win1Multiplier, 2);
                $welfareTicketWin2Multiplier = round($welfareTicketSettings->win2Multiplier, 2);
                $welfareTicketWin3Multiplier = round($welfareTicketSettings->win3Multiplier, 2);

                $welfareTicketDealerUserID = $welfareTicketData->dealer_id;

                $welfareTicketPurchaseData = WelfareTicketPurchase::where(["welfare_id" => $welfareTickeID])->get();
                $welfareTicketDealerPurchaseData = null;
                $totalWinCount = 0;
                $totalLoseCount = 0;

                foreach ($welfareTicketPurchaseData as $key => $value) {
                    $currentUserID = $value->user_id;
                    $currentUserData = User::find($currentUserID);

                    if ($value->numbers === "dealer") {
                        $welfareTicketDealerPurchaseData = $value;
                        continue;
                    }

                    $numbers = json_decode($value->numbers);
                    $bet = $value->bet;
                    $hitCountRequired = count($numbers);
                    $hitCount = 0;
                    $winValue = 0;
                    $redResultClone = explode(",", $red);
                    $pointer = 0;

                    for ($i = 0; $i < $hitCountRequired; $i++) {
                        $betValue = $numbers[$i];
                        $isHit = false;

                        foreach ($redResultClone as $ballValue) {
                            if ($ballValue == $betValue) {
                                $isHit = true;
                                unset($redResultClone[$pointer]);
                                $redResultClone = array_values($redResultClone);
                                break;
                            }
                            $pointer++;
                        }

                        if ($isHit === true) {
                            $hitCount++;
                        }
                    }

                    if ($hitCountRequired === $hitCount) {
                        $multiplier = 0;

                        if ($hitCount === 1) {
                            $multiplier = $welfareTicketWin1Multiplier;
                        } else if ($hitCount === 2) {
                            $multiplier = $welfareTicketWin2Multiplier;
                        } else if ($hitCount === 3) {
                            $multiplier = $welfareTicketWin3Multiplier;
                        }

                        $winValue = $bet + ($bet * $multiplier);
                        $totalWinCount += $winValue;

                        $currentUserData->money += $winValue;
                        $currentUserData->save();

                        $this->notifications->sync(new WelfareTicketBlueprint($value), [$currentUserData]);

                    } else {
                        $totalLoseCount += $bet;
                    }

                    $value->win_total = $winValue;
                    $value->opened = 1;
                    $value->save();
                }

                if (isset($welfareTicketDealerUserID)) {
                    $dealerGrossProfit = -$totalWinCount + $totalLoseCount;
                    $dealerTotalProfit = $dealerGrossProfit < 0 ? 0 : $dealerGrossProfit;

                    if ($dealerTotalProfit > 0) {
                        $dealerUserData = User::find($welfareTicketDealerUserID);
                        $dealerTotalProfit = $dealerTotalProfit * ((100 - $welfareTicketDealerBetCut) / 100);
                        $dealerUserData->money += $dealerTotalProfit;
                        $dealerUserData->save();
                    }

                    $welfareTicketDealerPurchaseData->win_total = $dealerTotalProfit;
                    $welfareTicketDealerPurchaseData->opened = 1;
                    $welfareTicketDealerPurchaseData->save();
                    $this->notifications->sync(new WelfareTicketBlueprint($welfareTicketDealerPurchaseData), [$dealerUserData]);
                }

                $logch = curl_init();
                $logurl = "http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjVedio/findInfo?name=3d&src=src";
                curl_setopt($logch, CURLOPT_URL, $logurl);
                curl_setopt($logch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0');
                curl_setopt($logch, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt($logch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($logch, CURLOPT_CONNECTTIMEOUT, 120);
                curl_setopt($logch, CURLOPT_TIMEOUT, 120);
                curl_setopt($logch, CURLOPT_COOKIE, "HMF_CI=113241");
                $log_result = json_decode(curl_exec($logch));
                $log_data = $log_result->result[0];
                $logofile = explode(".mp4", $log_data->logofile);
                $playback = $logofile[0] . ".mp4";

                $welfareTicketData->result = json_encode($redResult);
                $welfareTicketData->activated = 0;
                $welfareTicketData->save();

                $welfareTicketNextData = new WelfareTicket();
                $welfareTicketNextData->id = $type . ($code + 1);
                $welfareTicketNextData->title = "";
                $welfareTicketNextData->playback = str_replace("http", "https", $playback);
                $welfareTicketNextData->image = "https://mutluresim.com/images/2023/02/05/UlzW0.jpg";
                $welfareTicketNextData->desc = "";
                $welfareTicketNextData->type = 1;
                $welfareTicketNextData->cost = 1;
                $welfareTicketNextData->settings = json_encode(array(
                    'dealerBet' => 1000000,
                    'dealerBetCut' => 10,
                    'win1Multiplier' => 1,
                    'win2Multiplier' => 3,
                    'win3Multiplier' => 7,
                ), JSON_FORCE_OBJECT);
                $welfareTicketNextData->activated = 1;
                $welfareTicketNextData->assigned_at = $serverDate;
                $welfareTicketNextData->save();
            }

            // $this->info('Sync done.');
        }
    }

}
