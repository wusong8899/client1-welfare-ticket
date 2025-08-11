<?php

use Flarum\Extend;

use wusong8899\WelfareTicket\Controllers\WelfareTicketIndexController;
use wusong8899\WelfareTicket\Controllers\WelfareTicketHistoryIndexController;
use wusong8899\WelfareTicket\Controllers\ListWelfareTicketController;
use wusong8899\WelfareTicket\Controllers\WelfareTicketAddController;
use wusong8899\WelfareTicket\Controllers\WelfareTicketUpdateController;
use wusong8899\WelfareTicket\Controllers\WelfareTicketPurchaseController;
use wusong8899\WelfareTicket\Controllers\WelfareTicketPurchaseCountController;
use wusong8899\WelfareTicket\Controllers\WelfareTicketPurchaseHistorySummaryController;
use wusong8899\WelfareTicket\Controllers\ListWelfareTicketPurchaseHisotryController;

use wusong8899\WelfareTicket\Console\WelfareTicketScheduleCommand;
use wusong8899\WelfareTicket\Console\PublishSchedule;
use wusong8899\WelfareTicket\Notification\WelfareTicketBlueprint;
use wusong8899\WelfareTicket\Serializer\WelfareTicketPurchaseSerializer;

$extend = [
    (new Extend\Frontend('admin'))->js(__DIR__ . '/js/dist/admin.js')->css(__DIR__ . '/less/admin.less'),
    (new Extend\Frontend('forum'))->js(__DIR__ . '/js/dist/forum.js')->css(__DIR__ . '/less/forum.less')
        ->route('/welfareTicket', 'welfare.index', WelfareTicketIndexController::class)
        ->route('/welfareTicketHistory', 'welfare.history', WelfareTicketHistoryIndexController::class),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\Routes('api'))
        ->get('/welfareTicketList', 'welfare.get', ListWelfareTicketController::class)
        ->post('/welfareTicketList', 'welfare.add', WelfareTicketAddController::class)
        ->patch('/welfareTicketList/{id}', 'welfare.update', WelfareTicketUpdateController::class)
        ->post('/welfareTicketPurchase', 'welfare.purchase', WelfareTicketPurchaseController::class)
        ->get('/welfareTicketPurchase', 'welfare.history', ListWelfareTicketPurchaseHisotryController::class)
        ->get('/welfareTicketPurchaseCount', 'welfare.purchaseCount', WelfareTicketPurchaseCountController::class)
        ->get('/welfareTicketPurchaseHistorySummary', 'welfare.summary', WelfareTicketPurchaseHistorySummaryController::class),

    (new Extend\Settings())
        ->serializeToForum('welfareDisplayName', 'wusong8899-welfare-ticket.welfareDisplayName', 'strval')
        ->serializeToForum('welfareTimezone', 'wusong8899-welfare-ticket.welfareTimezone'),

    (new Extend\Console())
        ->command(WelfareTicketScheduleCommand::class)
        ->schedule(WelfareTicketScheduleCommand::class, new PublishSchedule()),
    (new Extend\Notification())
        ->type(WelfareTicketBlueprint::class, WelfareTicketPurchaseSerializer::class, ['alert']),
];

return $extend;