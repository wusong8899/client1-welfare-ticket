<?php

namespace wusong8899\WelfareTicket\Controllers;

use wusong8899\WelfareTicket\Serializer\WelfareTicketSerializer;
use wusong8899\WelfareTicket\Model\WelfareTicket;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Support\Carbon;

class WelfareTicketAddController extends AbstractCreateController
{
    public $serializer = WelfareTicketSerializer::class;
    protected $settings;
    protected $translator;

    public function __construct(Translator $translator, SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
        $this->translator = $translator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $actor->assertAdmin();

        $requestData = $request->getParsedBody()['data']['attributes'];
        $errorMessage = "";

        if (!isset($requestData)) {
            $errorMessage = 'wusong8899-guaguale.admin.guaguale-add-error';
        } else {
            $defaultTimezone = 'Asia/Shanghai';
            $settingTimezone = $this->settings->get('wusong8899-welfare-ticket.welfareTimezone', $defaultTimezone);

            if (!in_array($settingTimezone, timezone_identifiers_list())) {
                $settingTimezone = $defaultTimezone;
            }

            $welfareTicketData = new WelfareTicket();
            $welfareTicketData->id = $requestData['type'] . $requestData['id'];
            $welfareTicketData->title = $requestData['title'];
            $welfareTicketData->desc = "";
            $welfareTicketData->image = $requestData['image'];
            $welfareTicketData->color = $requestData['image'] ? null : $requestData['color'];
            $welfareTicketData->type = $requestData['type'];
            $welfareTicketData->cost = $requestData['cost'];
            $welfareTicketData->settings = $requestData['settings'];
            $welfareTicketData->activated = 1;
            $welfareTicketData->assigned_at = Carbon::now($settingTimezone);
            $welfareTicketData->save();

            return $welfareTicketData;
        }

        if ($errorMessage !== "") {
            throw new ValidationException(['message' => $this->translator->trans($errorMessage)]);
        }
    }
}
