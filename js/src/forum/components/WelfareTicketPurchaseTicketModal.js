import app from 'flarum/forum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Alert from 'flarum/common/components/Alert';
import Select from 'flarum/common/components/Select';
import Stream from 'flarum/utils/Stream';
import WelfareTicketSuccessModal from './WelfareTicketSuccessModal';

export default class WelfareTicketPurchaseTicketModal extends Modal {
  static isDismissible = false;

  oninit(vnode) {
    super.oninit(vnode);
    this.welfareTicketData = this.attrs.welfareTicketData;
    this.moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    this.currentMoney = app.session.user.attribute("money");

    const welfareTicketIdString = (this.welfareTicketData.id()).toString();
    this.welfareTicketID = welfareTicketIdString.substring(1);
    this.welfareTotalBall = 3;

    const welfareTicketSettings = JSON.parse(this.welfareTicketData.settings());

    this.welfareTicketSelectedBallWinMultiplier = {
      0:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-none'),
      1:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-count',{count:1,multiplier:welfareTicketSettings.win1Multiplier}),
      2:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-count',{count:2,multiplier:welfareTicketSettings.win2Multiplier}),
      3:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-count',{count:3,multiplier:welfareTicketSettings.win3Multiplier}),
    };

    this.welfareTicketBall = {
      ball1:Stream(0),
      ball2:Stream(0),
      ball3:Stream(0),
    };

  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-season-3D',{id:this.welfareTicketID});
  }

  content() {
    const moneyNameText = this.moneyName.replace('[money]', this.currentMoney);
    const moneyCostText = this.moneyName.replace('[money]', 0);

    let ball1 = this.welfareTicketBall["ball1"]();
    let ball2 = this.welfareTicketBall["ball2"]();
    let ball3 = this.welfareTicketBall["ball3"]();

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-select-number')}</label>
            <Select style="width:100px;" value={ball1} options={["无",0,1,2,3,4,5,6,7,8,9]} buttonClassName="Button" onchange={(e) => {this.updateSelection(e,1);}} />
            <Select style="width:100px;margin-left:20px;" value={ball2} options={["无",0,1,2,3,4,5,6,7,8,9]} buttonClassName="Button" onchange={(e) => {this.updateSelection(e,2);}} />
            <Select style="width:100px;margin-left:20px;" value={ball3} options={["无",0,1,2,3,4,5,6,7,8,9]} buttonClassName="Button" onchange={(e) => {this.updateSelection(e,3);}} />
            <div style="padding-top:10px">{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-bet')}</div>
            <div style="padding-top:10px"><input required id="WelfareBetInput" className="FormControl" type="number" step="0.01" min="1" max={this.currentMoney} onchange={() => this.updateBetInput()} onkeyup={() => this.updateBetInput()} /></div>
            <div style="padding-top:10px">{app.translator.trans('wusong8899-guaguale.forum.guaguale-current-money-amount')}{moneyNameText}</div>
            <div style="padding-top:10px">{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-multiplier')}<span id="welfareTicketWinMultiplierText">{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-none')}</span></div>
          </div>
          <div className="Form-group" style="text-align: center;">
            {Button.component(
              {
                className: 'Button Button--primary',
                type: 'submit',
                loading: this.loading,
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
        </div>
      </div>
    );
  }

  precisionRound(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  updateSelection(value,id){
    this.welfareTicketBall["ball"+id](value);

    let selectedBallCount = 0;
    for(let i=1;i<=this.welfareTotalBall;i++){
      if(parseInt(this.welfareTicketBall["ball"+i]())!==0){
        selectedBallCount++;
      }
    }

    $("#welfareTicketWinMultiplierText").text((this.welfareTicketSelectedBallWinMultiplier[selectedBallCount]).join(""));
  }

  updateBetInput(){
    //
    let WelfareBetValue = this.precisionRound($("#WelfareBetInput").val(),2);
    const availableMoney = this.currentMoney;

    if(WelfareBetValue>availableMoney){
      $("#WelfareBetInput").val(availableMoney);
    }
  }

  onsubmit(e) {
    e.preventDefault();

    const welfareBetValue = this.precisionRound($("#WelfareBetInput").val(),2);
    const welfareTicketID = this.welfareTicketID;
    const welfareTicketNumbers = [];

    for(let i=1;i<=this.welfareTotalBall;i++){
      const welfareTicketBallValue = parseInt(this.welfareTicketBall["ball"+i]());

      if(welfareTicketBallValue===0){

      }else{
        welfareTicketNumbers.push(welfareTicketBallValue-1);
      }
    }

    if(welfareTicketNumbers.length===0){
      app.alerts.show(Alert, {type: 'error'}, app.translator.trans('wusong8899-welfare-ticket.forum.purchase-error-no-number-selected'));
      return;
    }

    if(welfareBetValue===0){
      app.alerts.show(Alert, {type: 'error'}, app.translator.trans('wusong8899-welfare-ticket.forum.purchase-error-no-bet'));
      return;
    }

    const welfarePurchaseData = {
      welfare_id:welfareTicketID,
      bet:welfareBetValue,
      type:1,
      numbers:welfareTicketNumbers
    };

    this.loading = true;

    app.store
      .createRecord("welfareTicketPurchase")
      .save(welfarePurchaseData)
      .then(
        (welfareTicketPurchase) => {
          app.store.pushPayload(welfareTicketPurchase);
          app.modal.show(WelfareTicketSuccessModal);
          app.session.user.data.attributes.money-=welfareBetValue;
          this.loading = false;
        }
      )
      .catch((e) => {
        this.loading = false;
      });
  }
}
