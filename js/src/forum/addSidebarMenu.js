import { extend } from 'flarum/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/components/IndexPage';
import LinkButton from 'flarum/components/LinkButton';

export default function addSidebarMenu() {
  extend(IndexPage.prototype, 'navItems', function (items) {
    let welfareTicketNameSetting = app.forum.attribute("welfareDisplayName");
    let welfareTicketDisplayName = welfareTicketNameSetting===""?app.translator.trans('wusong8899-welfare-ticket.forum.welfare-display-name-default'):welfareTicketNameSetting;

    items.add(
      'WelfareTicket',
      <LinkButton icon="fas fa-ticket-alt" href={app.route('welfareTicket')}>
        {welfareTicketDisplayName}
      </LinkButton>,
      15
    );

    return items;
  });
}
