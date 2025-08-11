import app from 'flarum/forum/app';
import { extend } from 'flarum/extend';
import addSidebarMenu from './addSidebarMenu';
import addUserPage from "./addUserPage";
import WelfareTicket from "./model/WelfareTicket";
import WelfareTicketPurchase from "./model/WelfareTicketPurchase";
import WelfareTicketPurchaseCount from "./model/WelfareTicketPurchaseCount";
import WelfareTicketPurchaseSummary from "./model/WelfareTicketPurchaseSummary";
import WelfareTicketIndexPage from './components/WelfareTicketIndexPage';
import WelfareTicketHistoryIndexPage from './components/WelfareTicketHistoryIndexPage';
import WelfareTicketNotification from "./components/WelfareTicketNotification";

import NotificationGrid from "flarum/components/NotificationGrid";

app.initializers.add('wusong8899-welfare-ticket', () => {
  app.store.models.welfareTicketList = WelfareTicket;
  app.store.models.welfareTicketPurchase = WelfareTicketPurchase;
  app.store.models.welfareTicketPurchaseCount = WelfareTicketPurchaseCount;
  app.store.models.welfareTicketPurchaseHistorySummary = WelfareTicketPurchaseSummary;
  app.notificationComponents.welfareTicketPurchase = WelfareTicketNotification;

  app.routes['welfareTicket'] = {
    path: '/welfareTicket',
    component: WelfareTicketIndexPage,
  };

  app.routes['welfareTicketHistory'] = {
    path: '/welfareTicketHistory',
    component: WelfareTicketHistoryIndexPage,
  };
  
  addSidebarMenu();
  addUserPage();

  extend(NotificationGrid.prototype, "notificationTypes", function (items) {
    items.add("welfareTicketPurchase", {
      name: "welfareTicketPurchase",
      icon: "fas fa-ticket-alt",
      label: app.translator.trans(
        "wusong8899-welfare-ticket.forum.welfare-receive-open-result"
      ),
    });
  });
});