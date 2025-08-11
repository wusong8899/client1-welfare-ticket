<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketPurchaseSummarySerializer;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;

use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class WelfareTicketPurchaseHistorySummaryController extends AbstractListController
{
    public $serializer = WelfareTicketPurchaseSummarySerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $userID = $actor->id;
        $costTotalResult = WelfareTicketPurchase::where(["user_id" => $userID])->sum("bet");
        $winTotalResult = WelfareTicketPurchase::where(["user_id" => $userID])->sum("win_total");

        $welfareTicketPurchaseSummary = array(
            array("betTotal" => round($costTotalResult, 2), "winTotal" => round($winTotalResult, 2)),
        );

        return $welfareTicketPurchaseSummary;
    }
}
