<?php

namespace wusong8899\WelfareTicket\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class WelfareTicketPurchaseCountSerializer extends AbstractSerializer
{
    protected $type = 'welfareTicketPurchaseCount';

    protected function getDefaultAttributes($data)
    {
        $attributes = [
            'welfare_id' => $data->id,
            'total_purchase_count' => $data->total_purchase_count,
            'total_win_count' => $data->total_win_count,
        ];

        return $attributes;
    }
}
