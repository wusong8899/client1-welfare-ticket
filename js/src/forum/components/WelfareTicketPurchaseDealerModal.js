import app from 'flarum/forum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Alert from 'flarum/common/components/Alert';
import Select from 'flarum/common/components/Select';
import Stream from 'flarum/utils/Stream';
import WelfareTicketDealerSuccessModal from './WelfareTicketDealerSuccessModal';

export default class WelfareTicketPurchaseDealerModal extends Modal {
  static isDismissible = false;

  oninit(vnode) {
    super.oninit(vnode);
    this.welfareTicketData = this.attrs.welfareTicketData;
    const welfareTicketSettings = JSON.parse(this.welfareTicketData.settings());
    this.welfareTicketDealerBet = this.precisionRound(welfareTicketSettings.dealerBet,2);
    this.currentMoney = app.session.user.attribute("money");

  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-dealer');
  }

  content() {
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    const moneyNameText = moneyName.replace('[money]', this.currentMoney);
    const welfareTicketDealerBetText = moneyName.replace('[money]', this.welfareTicketDealerBet);

    if(this.currentMoney>=this.welfareTicketDealerBet){
      return [
        <div className="Modal-body">
          <h3>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-dealer-confirm',{cost:welfareTicketDealerBetText,money:moneyNameText})}</h3>
          <div style="text-align:center;padding-top: 20px;">
              {Button.component({
                  style:'width:66px',
                  className: 'Button Button--primary',
                  type: 'submit',
                },
                app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-ok')
              )}&nbsp;
              {Button.component(
                {
                  className: 'Button transferMoneyButton--gray',
                  loading: this.loading,
                  onclick: () => {
                    this.hide();
                  }
                },
                app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-cancel')
              )}
            </div>
        </div>,
      ];
    }else{
      return [
        <div className="Modal-body">
          <h3>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-dealer-insuffcient-fund',{cost:welfareTicketDealerBetText,money:moneyNameText})}</h3>
          <div style="text-align:center;padding-top: 20px;">
              {Button.component({
                  style:'width:66px',
                  className: 'Button Button--primary',
                  onclick: () => {
                    this.hide();
                  }
                },
                app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-ok')
              )}
            </div>
        </div>,
      ];
    }
  }

  precisionRound(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  onsubmit(e) {
    e.preventDefault();

    this.welfareTicketData.save({
        purchaseDealer:true
      })
      .then(
        () => {
          app.session.user.data.attributes.money-=this.welfareTicketDealerBet;
          app.modal.show(WelfareTicketDealerSuccessModal);
        },
        (response) => {
          this.loading = false;
        }
      );
  }
}
