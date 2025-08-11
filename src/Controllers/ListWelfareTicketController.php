<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketSerializer;
use wusong8899\WelfareTicket\Model\WelfareTicket;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;

use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListWelfareTicketController extends AbstractListController
{
    public $serializer = WelfareTicketSerializer::class;
    public $include = ['dealerData'];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $params = $request->getQueryParams();
        $include = $this->extractInclude($request);
        $filter = $params["page"]["filter"];
        $filterItem = $filter["item"];

        if ($filterItem === "all") {
            $welfareTicketData = WelfareTicket::where("activated", "!=", 2)->orderBy('assigned_at', 'desc')->get();
        } else if ($filterItem === "active") {
            $welfareTicketData = WelfareTicket::where([['activated', '!=', 2], ['result', '=', null]])->orderBy('id', 'asc')->limit(1)->get();
        } else if ($filterItem === "history") {
            $welfareTicketData = WelfareTicket::where([['result', '!=', null]])->orderBy('assigned_at', 'desc')->limit(1)->get();
        }

        $this->loadRelations($welfareTicketData, $include);

        return $welfareTicketData;
    }
}
