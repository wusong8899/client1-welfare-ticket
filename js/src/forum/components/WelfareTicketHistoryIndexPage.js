import Page from 'flarum/components/Page';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/common/helpers/listItems';
import LoadingIndicator from "flarum/components/LoadingIndicator";
import WelfareTicketListItem from "./WelfareTicketListItem";
import Button from 'flarum/components/Button';

export default class WelfareTicketHistoryIndexPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    this.bodyClass = 'App--index';
    this.loading = true;
    this.welfareTicketList = [];
    this.loadResults();
  }

  view() {
    let loading;

    if (this.loading) {
      loading = LoadingIndicator.component({ size: "large" });
    }

    return (
      <div className="IndexPage">
        {IndexPage.prototype.hero()}

        <div className="container">
          <div className="sideNavContainer">
            <nav className="IndexPage-nav sideNav">
              <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
            </nav>

            <div class="WelfareTicketGlobalContainer">
              {this.welfareTicketList.map((welfareTicketData) => {
                return (
                  <div style="padding-top:5px;">
                    {WelfareTicketListItem.component({ welfareTicketData})}
                  </div>
                );
              })}
              {!this.loading && (
                <div style="padding-top:10px;">
                  {Button.component({
                      className: 'Button',
                      onclick: () => {
                        this.showPurchaseHistory();
                      }
                    },
                    app.translator.trans('wusong8899-welfare-ticket.forum.welfare-ticket-view-history')
                  )}&nbsp;
                  {Button.component({
                      className: 'Button',
                      onclick: () => {
                        this.showWelfare();
                      }
                    },
                    app.translator.trans('wusong8899-welfare-ticket.forum.welfare-ticket-current')
                  )}
                </div>
              )}

              {!this.loading && this.welfareTicketList.length===0 && (
                <div>
                  <div style="font-size:1.4em;color: var(--muted-more-color);text-align: center;height: 300px;line-height: 100px;">{app.translator.trans("wusong8899-guaguale.forum.guaguale-list-empty")}</div>
                </div>
              )}

              {loading && <div className="WelfareTicket-loadMore">{loading}</div>}
            </div>

          </div>
        </div>
      </div>
    );
  }

  parseResults(results) {
    [].push.apply(this.welfareTicketList, results);
    this.loading = false;
    m.redraw();
    return results;
  }

  parsePurchaseResults(results) {
    [].push.apply(this.guagualePurchaseCountList, results);
    this.loading = false;
    m.redraw();
    return results;
  }

  loadResults() {
    const filter = {
      item:"history"
    };

    return app.store
      .find("welfareTicketList", {
        page: {
          filter
        },
      })
      .catch(() => {})
      .then(this.parseResults.bind(this));
  }

  showPurchaseHistory() {
    m.route.set(app.route("user.welfareTicketPurchaseHistory", {
      username: app.session.user.username(),
    }));
  }

  showWelfare() {
    m.route.set(app.route("welfareTicket"));
  }
}
