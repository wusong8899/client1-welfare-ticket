import Component from "flarum/Component";
import Button from 'flarum/components/Button';
import WelfareTicketSettingsAddModal from './WelfareTicketSettingsAddModal';
import WelfareTicketSettingsDeleteModal from './WelfareTicketSettingsDeleteModal';
import username from "flarum/helpers/username";

export default class WelfareTicketSettingsListItem extends Component {
  view() {
    const {welfareTicketData} = this.attrs;
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    let welfareTicketIdString = (welfareTicketData.id()).toString();

    const welfareTicketID = welfareTicketIdString.substring(1);
    const welfareTicketType = welfareTicketIdString[0];
    const welfareTicketTitle = welfareTicketData.title();
    const welfareTicketColor = welfareTicketData.color();
    const welfareTicketImage = welfareTicketData.image();
    const welfareTicketCost = welfareTicketData.cost();
    const welfareTicketAssignAt = welfareTicketData.assignedAt();
    const welfareTicketSettings = JSON.parse(welfareTicketData.settings());
    const welfareTicketDealerBet = welfareTicketSettings.dealerBet;
    const welfareTicketDealerBetCut = welfareTicketSettings.dealerBetCut;
    const welfareTicketWin1Multiplier = welfareTicketSettings.win1Multiplier;
    const welfareTicketWin2Multiplier = welfareTicketSettings.win2Multiplier;
    const welfareTicketWin3Multiplier = welfareTicketSettings.win3Multiplier;

    const welfareTicketDealerData = welfareTicketData.dealerData();
    let welfareTicketDealerText = welfareTicketDealerData===false?app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealer-none'):username(welfareTicketDealerData);

    const welfareTicketCostText = moneyName.replace('[money]', welfareTicketCost);
    const welfareTicketDealerBetText = moneyName.replace('[money]', welfareTicketDealerBet);

    const welfareTicketBackgroundColor = welfareTicketColor?welfareTicketColor:this.getBackgroundColor(welfareTicketAssignAt);
    const welfareTicketImageStyle = "width:200px;height:60px;background-image:url("+(welfareTicketImage===null?'':welfareTicketImage)+");background-color: "+welfareTicketBackgroundColor+";";
    
    return (
      <div style="border: 1px dotted var(--control-color);padding: 10px;border-radius: 4px;">
        <div>
          <div style="padding-top: 5px;">
            <Button className={'Button Button--primary'} onclick={() => this.editItem(welfareTicketData)}>
              {app.translator.trans('wusong8899-guaguale.admin.settings.guaguale-item-edit')}
            </Button>
            &nbsp;
            <Button style="font-weight:bold;width:66px;" className={'Button Button--danger'} onclick={() => this.deleteItem(welfareTicketData)}>
              {app.translator.trans('wusong8899-guaguale.admin.settings.guaguale-item-delete')}
            </Button>
          </div>
          <div style="padding-top: 5px;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-type')}: </b>
            {app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-type-'+welfareTicketType)}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-id')}: </b>
            {welfareTicketID}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-cost')}: </b>
            {welfareTicketCostText}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealer-name')}: </b>
            {welfareTicketDealerText}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealerBet')}: </b>
            {welfareTicketDealerBetText}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealerBetCut')}: </b>
            {welfareTicketDealerBetCut}%<br />
            <b>{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-multiplier')}: </b>
            {app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-1multiplier')}: 
            {welfareTicketWin1Multiplier}X&nbsp;/&nbsp;
            {app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-2multiplier')}: 
            {welfareTicketWin2Multiplier}X&nbsp;/&nbsp;
            {app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-3multiplier')}: 
            {welfareTicketWin3Multiplier}X
          </div>
        </div>
        <div style="padding-top:5px;">
          <div class="GuaGuaLeImageSettingsContainer" style={welfareTicketImageStyle}>
          </div>
        </div>
      </div>
    );
  }

  editItem(welfareTicketData) {
    app.modal.show(WelfareTicketSettingsAddModal, {welfareTicketData})
  }

  deleteItem(welfareTicketData) {
    app.modal.show(WelfareTicketSettingsDeleteModal, {welfareTicketData})
  }

  getBackgroundColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
}
