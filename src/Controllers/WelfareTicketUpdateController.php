<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketSerializer;
use wusong8899\WelfareTicket\Model\WelfareTicket;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;

use Flarum\User\User;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Support\Carbon;
use Illuminate\Support\Arr;

class WelfareTicketUpdateController extends AbstractCreateController
{
    public $serializer = WelfareTicketSerializer::class;
    protected $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $actor->assertAdmin();
        $welfareTickeID = Arr::get($request->getQueryParams(), 'id');
        $currentUserID = $request->getAttribute('actor')->id;

        if (!isset($welfareTickeID)) {
            $errorMessage = 'wusong8899-guaguale.admin.guaguale-save-error';
        } else {
            $welfareTicketSaveData = Arr::get($request->getParsedBody(), 'data', null);
            $errorMessage = "";
            $welfareTicketData = WelfareTicket::find($welfareTickeID);

            if (!isset($welfareTicketData)) {
                $errorMessage = 'wusong8899-guaguale.admin.guaguale-save-error';
            } else {
                if (Arr::has($welfareTicketSaveData, "attributes.title")) {
                    $welfareTicketData->title = Arr::get($welfareTicketSaveData, "attributes.title", "");
                    WelfareTicketPurchase::where(['welfare_id' => $welfareTickeID])->update(['title' => $welfareTicketData->title]);
                }
                if (Arr::has($welfareTicketSaveData, "attributes.desc")) {
                    $welfareTicketData->desc = Arr::get($welfareTicketSaveData, "attributes.desc", "");
                }
                if (Arr::has($welfareTicketSaveData, "attributes.cost")) {
                    $welfareTicketData->cost = Arr::get($welfareTicketSaveData, "attributes.cost", 1);
                }
                if (Arr::has($welfareTicketSaveData, "attributes.type")) {
                    $welfareTicketData->type = Arr::get($welfareTicketSaveData, "attributes.type", 1);
                }
                if (Arr::has($welfareTicketSaveData, "attributes.settings")) {
                    $welfareTicketData->settings = Arr::get($welfareTicketSaveData, "attributes.settings", null);
                }
                if (Arr::has($welfareTicketSaveData, "attributes.image")) {
                    $welfareTicketData->image = Arr::get($welfareTicketSaveData, "attributes.image", null);
                }
                if (Arr::has($welfareTicketSaveData, "attributes.color")) {
                    $welfareTicketData->color = Arr::get($welfareTicketSaveData, "attributes.color", null);
                }
                if (Arr::has($welfareTicketSaveData, "attributes.activated")) {
                    $welfareTicketData->activated = Arr::get($welfareTicketSaveData, "attributes.activated", 2);
                }

                if (Arr::has($welfareTicketSaveData, "attributes.purchaseDealer")) {
                    if ($welfareTicketData->activated == 1) {
                        if (!isset($welfareTicketData->dealer_id)) {
                            $welfareSettings = json_decode($welfareTicketData->settings);
                            $welfareDealerBet = round($welfareSettings->dealerBet, 2);

                            $currentUserData = User::find($currentUserID);
                            $currentUserMoneyRemain = $currentUserData->money - $welfareDealerBet;

                            if ($currentUserMoneyRemain < 0) {
                                $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error-insufficient-fund';
                            } else {
                                $welfareTicketData->dealer_id = $currentUserID;

                                $welfarePurchase = new WelfareTicketPurchase();
                                $welfarePurchase->title = $welfareTicketData->title;
                                $welfarePurchase->welfare_id = $welfareTickeID;
                                $welfarePurchase->user_id = $currentUserID;
                                $welfarePurchase->numbers = "dealer";
                                $welfarePurchase->bet = $welfareDealerBet;
                                $welfarePurchase->multiplier = 1;
                                $welfarePurchase->win_total = 0;
                                $welfarePurchase->opened = 0;
                                $welfarePurchase->assigned_at = Carbon::now($settingTimezone);
                                $welfarePurchase->save();

                                $currentUserData->money = $currentUserMoneyRemain;
                                $currentUserData->save();
                            }
                        } else {
                            $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error-dealer-exist';
                        }
                    } else {
                        $errorMessage = 'wusong8899-welfare-ticket.forum.purchase-error-welfare-closed';
                    }
                }


                if ($errorMessage === "") {
                    $welfareTicketData->save();
                    return $welfareTicketData;
                }
            }
        }

        if ($errorMessage !== "") {
            throw new ValidationException(['message' => $this->translator->trans($errorMessage)]);
        }
    }
}
