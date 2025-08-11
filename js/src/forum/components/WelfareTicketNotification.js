import app from 'flarum/forum/app';
import Notification from "flarum/components/Notification";

export default class WelfareTicketNotification extends Notification {
  icon() {
    return "fas fa-ticket-alt";
  }

  href() {
    return app.route("user.welfareTicketPurchaseHistory", {
      username: app.session.user.username(),
    });
  }

  content() {
    const notification = this.attrs.notification.subject();
    const welfareTicketNumbers = notification.numbers();
    const isDealer = welfareTicketNumbers==="dealer";

    const welfareTicketIdString = (notification.welfare_id()).toString();
    const welfareTicketID = welfareTicketIdString.substring(1);
    const welfareTicketTitle = app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-season-3D',{id:welfareTicketID})

    if(isDealer===true){
      return app.translator.trans('wusong8899-welfare-ticket.forum.notifications.open-content-dealer', {
        title: welfareTicketTitle
      });
    }else{
      return app.translator.trans('wusong8899-welfare-ticket.forum.notifications.open-content', {
        title: welfareTicketTitle
      });
    }
  }

  excerpt() {
    const notification = this.attrs.notification.subject();
    const welfareTicketNumbers = notification.numbers();
    const isDealer = welfareTicketNumbers==="dealer";

    const welfareTicketWinTotal = notification.win_total();
    const welfareTicketBetTotal = notification.bet();
    const welfareTicketPurchaseID = notification.id();
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    const welfareTicketWinTotalText = moneyName.replace('[money]', welfareTicketWinTotal);
    const welfareTicketBetTotalText = moneyName.replace('[money]', welfareTicketBetTotal);

    if(isDealer===true){
      const profitTotal = welfareTicketWinTotal-welfareTicketBetTotal;
      const profitTotalText = moneyName.replace('[money]', Math.abs(profitTotal));

      if(profitTotal>0){
        return app.translator.trans('wusong8899-welfare-ticket.forum.notifications.win-total-positive-dealer', {
          costTotal: welfareTicketBetTotalText,
          winTotal: welfareTicketWinTotalText,
          profitTotal: profitTotalText,
          purchaseID: welfareTicketPurchaseID
        });
      }else{
        return app.translator.trans('wusong8899-welfare-ticket.forum.notifications.win-total-negative-dealer', {
          costTotal: welfareTicketBetTotalText,
          winTotal: welfareTicketWinTotalText,
          profitTotal: profitTotalText,
          purchaseID: welfareTicketPurchaseID
        });
      }

    }else{

      return app.translator.trans('wusong8899-welfare-ticket.forum.notifications.win-total', {
        costTotal: welfareTicketBetTotalText,
        winTotal: welfareTicketWinTotalText,
        purchaseID: welfareTicketPurchaseID
      });
    }
  }
}
