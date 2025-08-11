<?php

namespace wusong8899\WelfareTicket\Model;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use wusong8899\WelfareTicket\Model\WelfareTicket;
use Flarum\User\User;

class WelfareTicketPurchase extends AbstractModel
{
    use ScopeVisibilityTrait;
    protected $table = 'wusong8899_welfare_purchase';

    public function welfareData()
    {
        return $this->hasOne(WelfareTicket::class, 'id', 'welfare_id');
    }

    public function purchasedUser()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
