<?php

namespace wusong8899\WelfareTicket\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use wusong8899\WelfareTicket\Serializer\WelfareTicketSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class WelfareTicketPurchaseSerializer extends AbstractSerializer
{
    protected $type = 'welfareTicketPurchase';

    protected function getDefaultAttributes($data)
    {
        $attributes = [
            'id' => $data->id,
            'title' => $data->title,
            'welfare_id' => $data->welfare_id,
            'user_id' => $data->user_id,
            'numbers' => $data->numbers,
            'bet' => $data->bet,
            'multiplier' => $data->multiplier,
            'win_total' => $data->win_total,
            'opened' => $data->opened,
            'assigned_at' => date("Y-m-d H:i:s", strtotime($data->assigned_at)),
        ];

        return $attributes;
    }

    protected function welfareData($data)
    {
        return $this->hasOne($data, WelfareTicketSerializer::class);
    }

    protected function purchasedUser($purchasedUser)
    {
        return $this->hasOne($purchasedUser, BasicUserSerializer::class);
    }
}
