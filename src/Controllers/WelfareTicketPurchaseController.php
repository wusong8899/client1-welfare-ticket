<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketPurchaseSerializer;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;
use wusong8899\WelfareTicket\Model\WelfareTicket;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\User\User;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Collection;

class WelfareTicketPurchaseController extends AbstractCreateController
{
    public $serializer = WelfareTicketPurchaseSerializer::class;
    protected $settings;
    protected $translator;

    public function __construct(Translator $translator, SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
        $this->translator = $translator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $requestData = $request->getParsedBody()['data']['attributes'];
        $welfareBet = round($requestData['bet'], 2);
        $welfareType = $requestData['type'];
        $welfareID = $welfareType . $requestData['welfare_id'];
        $welfareNumbers = $requestData['numbers'];
        $currentUserID = $request->getAttribute('actor')->id;
        $errorMessage = "";

        if (!isset($welfareBet) || !isset($welfareID) || $welfareBet <= 0) {
            $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error';
        } else {
            $welfareTicketData = WelfareTicket::where(["activated" => 1, "id" => $welfareID])->first();

            if (isset($welfareTicketData) && !isset($welfareTicketData->result) && $welfareTicketData->activated == 1) {
                $currentUserData = User::find($currentUserID);
                $currentUserMoneyRemain = $currentUserData->money - $welfareBet;

                if ($currentUserMoneyRemain < 0) {
                    $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error-insufficient-fund';
                } else {
                    $defaultTimezone = 'Asia/Shanghai';
                    $settingTimezone = $this->settings->get('wusong8899-welfare-ticket.welfareTimezone', $defaultTimezone);

                    if (!in_array($settingTimezone, timezone_identifiers_list())) {
                        $settingTimezone = $defaultTimezone;
                    }

                    $welfarePurchasedData = WelfareTicketPurchase::where(["welfare_id" => $welfareID, "user_id" => $currentUserID])->first();

                    if (!isset($welfarePurchasedData)) {
                        $welfareTicketData->purchased_total += 1;
                    }

                    $currentUserData->money = $currentUserMoneyRemain;
                    $currentUserData->save();

                    $welfareTicketData->bet_total += $welfareBet;
                    $welfareTicketData->save();

                    $welfarePurchase = new WelfareTicketPurchase();
                    $welfarePurchase->title = $welfareTicketData->title;
                    $welfarePurchase->welfare_id = $welfareID;
                    $welfarePurchase->user_id = $currentUserID;
                    $welfarePurchase->numbers = json_encode($welfareNumbers);
                    $welfarePurchase->bet = $welfareBet;
                    $welfarePurchase->multiplier = 1;
                    $welfarePurchase->win_total = 0;
                    $welfarePurchase->opened = 0;
                    $welfarePurchase->assigned_at = Carbon::now($settingTimezone);
                    $welfarePurchase->save();

                    return $welfarePurchase;
                }
            } else {
                if ($welfareTicketData->activated != 1) {
                    $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error-welfare-closed';
                } else {
                    $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error';
                }
            }
        }

        if ($errorMessage !== "") {
            throw new ValidationException(['message' => $this->translator->trans($errorMessage)]);
        }
    }
}
