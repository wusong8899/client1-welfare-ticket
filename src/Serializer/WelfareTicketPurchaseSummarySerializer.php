<?php

namespace wusong8899\WelfareTicket\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;

class WelfareTicketPurchaseSummarySerializer extends AbstractSerializer
{
    protected $type = 'welfareTicketPurchaseHistorySummary';

    protected function getDefaultAttributes($data)
    {
        $attributes = [
            'betTotal' => $data["betTotal"],
            'winTotal' => $data["winTotal"],
        ];

        return $attributes;
    }
}
