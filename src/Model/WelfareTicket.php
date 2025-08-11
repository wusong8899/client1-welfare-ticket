<?php

namespace wusong8899\WelfareTicket\Model;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;

class WelfareTicket extends AbstractModel
{
    use ScopeVisibilityTrait;
    protected $table = 'wusong8899_welfare';

    public function dealerData()
    {
        return $this->hasOne(User::class, 'id', 'dealer_id');
    }
}
