import Component from "flarum/Component";

export default class WelfareTicketPurchaseHistoryListItem extends Component {
  view() {
    const {welfareTicketHistory} = this.attrs;
    const welfareTicketIdString = (welfareTicketHistory.welfare_id()).toString();
    const welfareTicketID = welfareTicketIdString.substring(1);
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';

    const welfareTicketData = welfareTicketHistory.welfareData();
    const welfareTicketResult = welfareTicketData.result();
    const welfareTicketResultList = welfareTicketResult===null?[]:JSON.parse(welfareTicketResult);
    const welfareTicketSettings = JSON.parse(welfareTicketData.settings());

    const welfareTicketSelectedBallWinMultiplier = {
      1:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-count',{count:1,multiplier:welfareTicketSettings.win1Multiplier}),
      2:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-count',{count:2,multiplier:welfareTicketSettings.win2Multiplier}),
      3:app.translator.trans('wusong8899-welfare-ticket.forum.welfare-current-selection-count',{count:3,multiplier:welfareTicketSettings.win3Multiplier}),
    };

    const welfareTicketPurchaseID = welfareTicketHistory.id();
    const welfareTicketPurchaseBet = welfareTicketHistory.bet();
    const welfareTicketPurchaseWinTotal = welfareTicketHistory.win_total();
    const welfareTicketPurchaseWinTotalText = moneyName.replace('[money]', welfareTicketPurchaseWinTotal);
    const welfareTicketPurchaseBetText = moneyName.replace('[money]', welfareTicketPurchaseBet);
    const welfareTicketPurchaseOpened = parseInt(welfareTicketHistory.opened());

    const isDealer = welfareTicketHistory.numbers()==="dealer";
    let welfareTicketPurchaseResult = "";
    let welfareResultStyle = "";

    if(isDealer===false){
      const welfareTicketPurchaseNumbers = JSON.parse(welfareTicketHistory.numbers());
      const hitCountRequired = welfareTicketPurchaseNumbers.length;
      let hitCount = 0;

      if(welfareTicketPurchaseOpened===0){
        welfareTicketPurchaseResult = app.translator.trans("wusong8899-welfare-ticket.forum.welfare-result-not-ready");
          welfareResultStyle = "color:gray";
      }else{
        if(welfareTicketPurchaseWinTotal===0){
          welfareTicketPurchaseResult = app.translator.trans("wusong8899-welfare-ticket.forum.welfare-result-not-hit");
          welfareResultStyle = "color:red";
        }else{
          welfareTicketPurchaseResult = app.translator.trans("wusong8899-welfare-ticket.forum.welfare-result-win-price",{hitCount:hitCountRequired,money:welfareTicketPurchaseWinTotalText});
          welfareResultStyle = "color:green";
        }
      }

      const WelfareTicketBallStyle = "opacity: 0.9;width: 24px;height: 27px;line-height: 27px;";

      return (
        <div className="welfareTicketHistoryContainer">
          <div style="padding-top: 5px;font-size: 16px;color: lightgoldenrodyellow;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-season-3D',{id:welfareTicketID})}</b>
          </div>
          <div>
            <div style="float: right;margin-top:-25px;">
              {welfareTicketResult!==null && welfareTicketResultList.map((resultData) => {
                let isHit = welfareTicketPurchaseNumbers.indexOf(parseInt(resultData));
                let ballStyle = "display:inline-block;margin-left: 2px;padding:4px;";

                if(welfareTicketPurchaseWinTotal>0 && isHit!==-1 && hitCount<hitCountRequired){
                  ballStyle+="border: 1px solid lightgoldenrodyellow;border-radius: 4px;";
                  hitCount++;
                }

                return (
                  <div style={ballStyle}>
                    <div class='WelfareTicketBallBlue' style={WelfareTicketBallStyle}>{resultData}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style="padding-top: 5px;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-id')}: </b>
            {welfareTicketPurchaseID}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-bet')}: </b>
            {welfareTicketPurchaseBetText}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-numbers')}: </b>
            <div style="display:inline-block;border:1px solid var(--text-color);padding: 0px 4px;margin-left: 4px;">{welfareTicketPurchaseNumbers.join(",")}</div>
          </div>
          <div style="padding-top: 5px;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-result-type')}: </b>
            {welfareTicketSelectedBallWinMultiplier[hitCountRequired]}&nbsp;|&nbsp;
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-result')}: </b>
            <span style={welfareResultStyle}>
              {welfareTicketPurchaseResult}
            </span>
          </div>
        </div>
      );
    }else{
      if(welfareTicketPurchaseOpened===0){
        welfareTicketPurchaseResult = app.translator.trans("wusong8899-welfare-ticket.forum.welfare-result-not-ready");
          welfareResultStyle = "color:gray";
      }else{
        const profitTotal = welfareTicketPurchaseWinTotal-welfareTicketPurchaseBet;
        const profitTotalText = moneyName.replace('[money]', Math.abs(profitTotal));

        if(profitTotal<=0){
          welfareResultStyle = "color:red";
          welfareTicketPurchaseResult = app.translator.trans("wusong8899-welfare-ticket.forum.welfare-result-dealer-negative-profit",{money:profitTotalText});
        }else{
          welfareResultStyle = "color:green";
          welfareTicketPurchaseResult = app.translator.trans("wusong8899-welfare-ticket.forum.welfare-result-dealer-positive-profit",{money:profitTotalText});
        }
      }

      return (
        <div className="welfareTicketHistoryContainer">
          <div style="padding-top: 5px;font-size: 16px;color: lightgoldenrodyellow;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-season-3D',{id:welfareTicketID})}</b>
          </div>
          <div>
            <div class="WelfareRainbowTextAnimated" style="float: right;margin-top:-25px;font-size: 24px;">
              <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-is-dealer')}</b>
            </div>
          </div>
          <div style="padding-top: 5px;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-item-dealer-bet')}: </b>
            {welfareTicketPurchaseBetText}
          </div>

          <div style="padding-top: 5px;">
            <b>{app.translator.trans('wusong8899-welfare-ticket.forum.welfare-result-dealer-profit')}: </b>
            <span style={welfareResultStyle}>
              {welfareTicketPurchaseResult}
            </span>
          </div>
        </div>
      );
    }
  }

  precisionRound(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}
