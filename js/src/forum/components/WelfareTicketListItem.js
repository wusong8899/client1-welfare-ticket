import Component from "flarum/Component";
import Link from "flarum/components/Link";
import Button from 'flarum/components/Button';
import WelfareTicketPurchaseTicketModal from './WelfareTicketPurchaseTicketModal';
import WelfareTicketPurchaseDealerModal from './WelfareTicketPurchaseDealerModal';
import LogInModal from "flarum/components/LogInModal";
import username from "flarum/helpers/username";

export default class WelfareTicketListItem extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
  }

  view() {
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    const {welfareTicketData} = this.attrs;
    const welfareTicketIdString = (welfareTicketData.id()).toString();
    const welfareTicketID = welfareTicketIdString.substring(1);
    const welfareTicketImage = welfareTicketData.image();
    const welfareTicketType = welfareTicketData.type();
    const welfareTicketPlayback = welfareTicketData.playback();
    const welfareTicketColor = welfareTicketData.color();
    const welfareDealerID = welfareTicketData.dealer_id();
    const welfareTicketResult = welfareTicketData.result()===null?[]:JSON.parse(welfareTicketData.result());
    const welfareTicketAssignAt = welfareTicketData.assignedAt();
    const backgroundStyle = "background-image:url("+(welfareTicketImage===null?'':welfareTicketImage)+");background-color: "+(welfareTicketColor?welfareTicketColor:this.getBackgroundColor(welfareTicketAssignAt))+";";
    const WelfareTicketBallStyle = welfareTicketColor?"opacity: 0.9;":"";
    const welfareTicketActivated = welfareTicketData.activated();

    const welfareTicketBetTotal = welfareTicketData.bet_total();
    const welfareTicketSettings = JSON.parse(welfareTicketData.settings());
    const welfareTicketDealerBet = welfareTicketSettings.dealerBet;
    const welfareTicketDealerBetCut = welfareTicketSettings.dealerBetCut;
    const welfareTicketDealerBetText = moneyName.replace('[money]', welfareTicketDealerBet);
    const welfareTicketBetTotalText = moneyName.replace('[money]', welfareTicketBetTotal);

    const welfareTicketDealerData = welfareTicketData.dealerData();
    let welfareTicketDealerText = welfareTicketDealerData===false?app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-dealer-none'):username(welfareTicketDealerData);

    const welfareTicketPurchaseButtonContainerStyle = welfareDealerID===null?"display: inline-block;width: 165px;":"display: inline-block;";

    return (
      <div>
      <div class="WelfareTicketContainer" style={backgroundStyle}>
        <div class="WelfareTicketMask" style="background: var(--shadow-color);">
          <div class="WelfareTicketSeason">
            <div style="position: absolute;color: lightgoldenrodyellow;">{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-season-3D',{id:welfareTicketID})}</div>
            <div style="filter: blur(20px);" class="WelfareRainbowTextAnimated">{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-season-3D',{id:welfareTicketID})}</div>
          </div>
          <div class="WelfareTicketDealer">
            {app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-dealer-name')}: {welfareTicketDealerText}&nbsp;|&nbsp;
            {app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-dealerBet')}: 
              {welfareTicketDealerBetText}&nbsp;
              ({app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-dealerBetCut')}{welfareTicketDealerBetCut}%)
          </div>
          <div class="WelfareTicketResult" style="height:60px">
            {welfareTicketActivated===0 && welfareTicketResult.length===0 && (
              <div class="WelfareFadingAnimated" style="height:50px;display:inline-block;color: lightgoldenrodyellow;">
                {app.translator.trans("wusong8899-welfare-ticket.forum.welfare-bet-closed")}
              </div>
            )}

            {welfareTicketActivated===1 && welfareTicketResult.length===0 && (
              <div style="height: 50px;">
                <div style={welfareTicketPurchaseButtonContainerStyle}>
                  <div class="WelfareTicketAssignTicket buttonRegister" onclick={() => this.purchaseTicket(welfareTicketData)}>
                    {app.translator.trans("wusong8899-welfare-ticket.forum.welfare-bet-now")}
                  </div>
                </div>

                {welfareDealerID===null && (
                  <div style="display:inline-block">
                    <div class="WelfareTicketAssignDealer buttonRegister" onclick={() => this.purchaseDealer(welfareTicketData)}>
                      {app.translator.trans("wusong8899-welfare-ticket.forum.welfare-become-dealer")}
                    </div>
                  </div>
                )}
              </div>
            )}

            {welfareTicketActivated===0 && welfareTicketResult.length>0 && welfareTicketResult.map((resultData) => {
              return (
                <div style="margin-left: 2px;padding: 4px;height: 70px;">
                  <div class='WelfareTicketBallBlue' style={WelfareTicketBallStyle}>{resultData}</div>
                </div>
              );
            })}
          </div>

          <div class="WelfareTicketDetails">
            {app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-bet-total')}: 
            {welfareTicketBetTotalText}
          </div>

        </div>
      </div>

      {welfareTicketPlayback!==null && welfareTicketResult.length===0 && (
        <div style="padding-top: 10px;">
          <h3 style="display: flex;align-items: center;"><div class="WelfareTicketReminder"></div>&nbsp;{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-playback')}</h3>
          <video controls="controls" style="width: 100%;border-radius: 12px;">
            <source src={welfareTicketPlayback} type="video/mp4" />
          </video>
        </div>
      )}

      </div>
    );
  }

  purchaseTicket(welfareTicketData) {
    //
    if (app.session.user) {
      app.modal.show(WelfareTicketPurchaseTicketModal, {welfareTicketData});
    } else {
      app.modal.show(LogInModal);
    }
  }

  purchaseDealer(welfareTicketData) {
    //
    if (app.session.user) {
      app.modal.show(WelfareTicketPurchaseDealerModal, {welfareTicketData});
    } else {
      app.modal.show(LogInModal);
    }
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
