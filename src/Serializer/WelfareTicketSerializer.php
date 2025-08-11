<?php

namespace wusong8899\WelfareTicket\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class WelfareTicketSerializer extends AbstractSerializer
{
    protected $type = 'welfareTicketList';

    protected function getDefaultAttributes($data)
    {
        $attributes = [
            'id' => $data->id,
            'title' => $data->title,
            'desc' => $data->desc,
            'color' => $data->color,
            'playback' => $data->playback,
            'image' => $data->image,
            'type' => $data->type,
            'amount' => $data->amount,
            'purchased' => $data->purchased,
            'bet_total' => $data->bet_total,
            'result' => $data->result,
            'dealer_id' => $data->dealer_id,
            'settings' => $data->settings,
            'cost' => $data->cost,
            'limit' => $data->limit,
            'activated' => $data->activated,
            'assigned_at' => date("Y-m-d H:i:s", strtotime($data->assigned_at))
        ];

        return $attributes;
    }

    protected function dealerData($data)
    {
        return $this->hasOne($data, BasicUserSerializer::class);
    }
}
