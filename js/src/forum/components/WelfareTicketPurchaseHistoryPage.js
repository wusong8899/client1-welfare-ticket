import UserPage from "flarum/components/UserPage";
import WelfareTicketPurchaseHistoryList from "./WelfareTicketPurchaseHistoryList";

export default class GuaGuaLePurchaseHistoryPage extends UserPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loadUser(m.route.param("username"));
  }

  content() {
    return (
      <div className="WelfareTicketPurchaseHistoryPage">
        {WelfareTicketPurchaseHistoryList.component({
          params: {
            user: this.user,
          },
        })}
      </div>
    );
  }
}
