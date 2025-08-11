<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketPurchaseSerializer;
use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;

use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Flarum\Http\UrlGenerator;

class ListWelfareTicketPurchaseHisotryController extends AbstractListController
{
    public $serializer = WelfareTicketPurchaseSerializer::class;
    public $include = ['welfareData'];
    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $params = $request->getQueryParams();
        $include = $this->extractInclude($request);
        $actor = $request->getAttribute('actor');
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        $userID = $actor->id;
        $welfareTicketPurchaseQuery = WelfareTicketPurchase::where(["user_id" => $userID]);
        $welfareTicketPurchaseResult = $welfareTicketPurchaseQuery
            ->skip($offset)
            ->take($limit + 1)
            ->orderBy('id', 'desc')
            ->get();

        $hasMoreResults = $limit > 0 && $welfareTicketPurchaseResult->count() > $limit;

        if ($hasMoreResults) {
            $welfareTicketPurchaseResult->pop();
        }

        $document->addPaginationLinks(
            $this->url->to('api')->route('welfare.history'),
            $params,
            $offset,
            $limit,
            $hasMoreResults ? null : 0
        );

        $this->loadRelations($welfareTicketPurchaseResult, $include);

        return $welfareTicketPurchaseResult;
    }
}
