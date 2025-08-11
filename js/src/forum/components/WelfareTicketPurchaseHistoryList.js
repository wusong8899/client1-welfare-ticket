import Component from "flarum/Component";
import app from "flarum/app";
import LoadingIndicator from "flarum/components/LoadingIndicator";
import Button from "flarum/components/Button";
import Link from "flarum/components/Link";

import WelfareTicketPurchaseHistoryListItem from "./WelfareTicketPurchaseHistoryListItem";

export default class WelfareTicketPurchaseHistoryList extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.moreResults = false;
    this.welfareTicketHistory = [];
    this.welfareTicketHistorySummary = null;
    this.user = this.attrs.params.user;
    this.loadResults();
  }

  view() {
    let loading;
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    let purchaseCostTotalText,purchaseWinTotalText;

    if(this.loading){
      loading = LoadingIndicator.component({ size: "large" });
      purchaseCostTotalText = moneyName.replace('[money]', "-");
      purchaseWinTotalText = moneyName.replace('[money]', "-");
    }else{
      purchaseCostTotalText = moneyName.replace('[money]', this.welfareTicketHistorySummary.betTotal());
      purchaseWinTotalText = moneyName.replace('[money]', this.welfareTicketHistorySummary.winTotal());
    }

    return (
      <div>
        <div style="display:flex;padding-bottom:10px">
          <div style="font-size: 24px;font-weight: bold;display:inline-block;padding-right: 10px;">
            {app.translator.trans("wusong8899-welfare-ticket.forum.welfare-ticket-view-history")}
          </div>
          <Button className={'Button Button--primary'} onclick={() => m.route.set(app.route("welfareTicket"))}>
            {app.translator.trans("wusong8899-welfare-ticket.forum.purchase-now")}
          </Button>
        </div>
        <div style="color:var(--muted-color);padding-bottom:10px;">
          {app.translator.trans("wusong8899-welfare-ticket.forum.purchase-summary",{
            purchaseCostTotal:purchaseCostTotalText,
            purchaseWinTotal:purchaseWinTotalText
          })}
        </div>
        <ul style="margin: 0;padding: 0;list-style-type: none;position: relative;">
          {this.welfareTicketHistory.map((welfareTicketHistory) => {
            return (
              <li style="padding-bottom:5px" data-id={welfareTicketHistory.id()}>
                {WelfareTicketPurchaseHistoryListItem.component({ welfareTicketHistory })}
              </li>
            );
          })}
        </ul>
          
        {!this.loading && this.welfareTicketHistory.length===0 && (
          <div>
            <div style="font-size:1.4em;color: var(--muted-more-color);text-align: center;height: 300px;line-height: 100px;">{app.translator.trans("wusong8899-guaguale.forum.guaguale-history-list-empty")}</div>
          </div>
        )}

        {!loading && this.hasMoreResults() && (
          <div style="text-align:center;padding:20px">
            <Button className={'Button Button--primary'} disabled={this.loading} loading={this.loading} onclick={() => this.loadMore()}>
              {app.translator.trans('wusong8899-guaguale.forum.guaguale-history-list-load-more')}
            </Button>
          </div>
        )}

        {loading && <div className="WelfareTicket-loadMore">{loading}</div>}
      </div>
    );
  }

  loadMore() {
    this.loading = true;
    this.loadResults(this.welfareTicketHistory.length);
  }

  parseResults(results) {
    this.moreResults = !!results.payload.links && !!results.payload.links.next;
    [].push.apply(this.welfareTicketHistory, results);

    return app.store
      .find("welfareTicketPurchaseHistorySummary")
      .catch(() => {})
      .then((summaryResult) => {
        this.welfareTicketHistorySummary = summaryResult[0];
        this.loading = false;
        m.redraw();

        return results;
      });

  }

  hasMoreResults() {
    return this.moreResults;
  }

  loadResults(offset = 0) {
    return app.store
      .find("welfareTicketPurchase", {
        filter: {
          user: this.user.id(),
        },
        page: {
          offset,
        },
      })
      .catch(() => {})
      .then(this.parseResults.bind(this));
  }
}
