<?php

namespace wusong8899\WelfareTicket\Model;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;

class WelfareTicketPurchaseCount extends AbstractModel
{
    use ScopeVisibilityTrait;
    protected $table = 'wusong8899_welfare_purchase_count';
    protected $fillable = ['user_id', 'welfare_id', 'total_purchase_count', 'total_win_count'];
}
