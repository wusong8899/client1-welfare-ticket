<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketPurchaseCountSerializer;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchaseCount;

use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class WelfareTicketPurchaseCountController extends AbstractListController
{
    public $serializer = WelfareTicketPurchaseCountSerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $params = $request->getQueryParams();
        $actor = $request->getAttribute('actor');
        $userID = $actor->id;

        if (isset($userID)) {
            $welfareTicketPurchaseCount = WelfareTicketPurchaseCount::select("welfare_id as id", "total_purchase_count", "total_win_count")->where(["user_id" => $userID])->get();
            return $welfareTicketPurchaseCount;
        }
    }
}
