import { extend } from "flarum/extend";
import UserPage from "flarum/components/UserPage";
import LinkButton from "flarum/components/LinkButton";
import WelfareTicketPurchaseHistoryPage from './components/WelfareTicketPurchaseHistoryPage';

export default function () {
  app.routes["user.welfareTicketPurchaseHistory"] = {
    path: "/u/:username/welfareTicketPurchaseHistory",
    component: WelfareTicketPurchaseHistoryPage,
  };

  extend(UserPage.prototype, "navItems", function (items,user) {
      if(app.session.user){
        const currentUserID = app.session.user.id();
        const targetUserID = this.user.id();

        if(currentUserID==targetUserID){
          items.add(
            "welfareTicketPurchaseHistory",
            LinkButton.component({
                href: app.route("user.welfareTicketPurchaseHistory", {
                  username: this.user.username(),
                }),
                icon: "fas fa-ticket-alt",
              },
              [
                app.translator.trans(
                  "wusong8899-welfare-ticket.forum.welfare-ticket-purchase-history"
                )
              ]
            ),
            10
          );
        }
      }
  });
}
