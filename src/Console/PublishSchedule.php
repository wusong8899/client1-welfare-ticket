<?php

namespace wusong8899\WelfareTicket\Console;

use Flarum\Foundation\Paths;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Console\Scheduling\Event;

class PublishSchedule
{
    public function __invoke(Event $event)
    {
        $settings = resolve(SettingsRepositoryInterface::class);

        $defaultTimezone = 'Asia/Shanghai';
        $settingTimezone = $settings->get('wusong8899-welfare-ticket.welfareTimezone', $defaultTimezone);

        if (!in_array($settingTimezone, timezone_identifiers_list())) {
            $settingTimezone = $defaultTimezone;
        }

        $event->twiceDaily(21, 22)->timezone($settingTimezone);
        $paths = resolve(Paths::class);
        $event->appendOutputTo($paths->storage . (DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'welfare-ticket.log'));
    }
}
