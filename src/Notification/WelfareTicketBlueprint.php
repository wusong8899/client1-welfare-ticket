<?php

namespace wusong8899\WelfareTicket\Notification;

use wusong8899\WelfareTicket\Model\WelfareTicketPurchase;
use Flarum\Notification\Blueprint\BlueprintInterface;

class WelfareTicketBlueprint implements BlueprintInterface
{
    public $welfareTicketPurchase;

    public function __construct(WelfareTicketPurchase $welfareTicketPurchase)
    {
        $this->welfareTicketPurchase = $welfareTicketPurchase;
    }

    public function getSubject()
    {
        return $this->welfareTicketPurchase;
    }

    public function getFromUser()
    {
        return $this->welfareTicketPurchase->purchasedUser;
    }

    public function getData()
    {
        return null;
    }

    public static function getType()
    {
        return 'welfareTicketPurchase';
    }

    public static function getSubjectModel()
    {
        return WelfareTicketPurchase::class;
    }
}
