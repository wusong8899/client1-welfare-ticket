import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Select from 'flarum/common/components/Select';
import Stream from 'flarum/utils/Stream';
import Alert from 'flarum/common/components/Alert';

export default class WelfareTicketSettingsAddModal extends Modal {
  static isDismissible = false;

  oninit(vnode) {
    super.oninit(vnode);
    this.welfareTicketData = this.attrs.welfareTicketData;
    this.settingType = "add";
    this.defaultAmount = 200;
    this.winChance = Stream(0);

    if(this.welfareTicketData){
      let welfareTicketIdString = (this.welfareTicketData.id()).toString();

      this.settingType = "edit";
      this.welfareTicketID = Stream(welfareTicketIdString.substring(1));
      this.welfareTicketTitle = Stream(this.welfareTicketData.title());
      this.welfareTicketColor = Stream(this.welfareTicketData.color());
      this.welfareTicketImage = Stream(this.welfareTicketData.image());
      this.welfareTicketType = Stream(this.welfareTicketData.type());
      this.welfareTicketCost = Stream(this.welfareTicketData.cost());
      const welfareTicketSettings = JSON.parse(this.welfareTicketData.settings());
      this.welfareTicketDealerBet = Stream(welfareTicketSettings.dealerBet);
      this.welfareTicketDealerBetCut = Stream(welfareTicketSettings.dealerBetCut);
      this.welfareTicketWin1Multiplier = Stream(welfareTicketSettings.win1Multiplier);
      this.welfareTicketWin2Multiplier = Stream(welfareTicketSettings.win2Multiplier);
      this.welfareTicketWin3Multiplier = Stream(welfareTicketSettings.win3Multiplier);
    }else{
      this.welfareTicketID = Stream("");
      this.welfareTicketTitle = Stream("");
      this.welfareTicketColor = Stream("");
      this.welfareTicketImage = Stream("");
      this.welfareTicketType = Stream("1");
      this.welfareTicketCost = Stream(1);
      this.welfareTicketSettings = Stream("");
      this.welfareTicketDealerBet = Stream(0);
      this.welfareTicketDealerBetCut = Stream(0);
      this.welfareTicketWin1Multiplier = Stream();
      this.welfareTicketWin2Multiplier = Stream();
      this.welfareTicketWin3Multiplier = Stream();
    }
  }

  onColorBackgroundSelectionReady(vnode) {
    if(this.welfareTicketImage()){
      $("#ColorBackgroundSelection").val("background");
    }else{
      $("#ColorBackgroundSelection").val("color");
    }
  }

  className() {
    return 'Modal--Large';
  }

  title() {
    return this.settingType==="add"?app.translator.trans('wusong8899-welfare-ticket.admin.welfare-add'):app.translator.trans('wusong8899-welfare-ticket.admin.welfare-edit');
  }

  content() {
    const welfareTicketColorPreviewStyle = "position: absolute;right: 12px;top: 6px;width:24px;height:24px;background-color:"+this.welfareTicketColor()+";border-radius: var(--border-radius);";
    const welfareTicketBackgroundContainerStyle = "display:"+(this.welfareTicketImage()?"":"none");
    const welfareTicketColorContainerStyle = this.welfareTicketImage()?"display:none":"";

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group" style="text-align: left;">
            <div>
              <div style="display:none">
                <div class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-type')}</div>
                <Select
                  value={this.welfareTicketType()}
                  options={{
                    '1': app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-type-1'),
                  }}
                  buttonClassName="Button"
                  onchange={this.welfareTicketType}
                />
              </div>

              <div class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-id')}</div>
              {this.settingType==="add" && (
                  <input required className="FormControl" type="number" step="1" min="1" bidi={this.welfareTicketID} />
              )}
              {this.settingType==="edit" && (
                  <input disabled required className="FormControl" type="number" step="1" min="1" bidi={this.welfareTicketID} />
              )}

              <div style="display:none" class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-cost')}</div>
              <input style="display:none" required className="FormControl" type="number" step="1" min="1" bidi={this.welfareTicketCost} />

              <div class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-multiplier')}</div>
              <input required style="display: inline-block;width: 150px;" className="FormControl" type="number" step="0.01" min="1" bidi={this.welfareTicketWin1Multiplier} placeholder={app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-1multiplier')} />
              <input required style="display: inline-block;width: 150px;margin-left: 10px;" className="FormControl" type="number" step="0.01" min="1" bidi={this.welfareTicketWin2Multiplier} placeholder={app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-2multiplier')} />
              <input required style="display: inline-block;width: 150px;margin-left: 10px;" className="FormControl" type="number" step="0.01" min="1" bidi={this.welfareTicketWin3Multiplier} placeholder={app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-win-3multiplier')} />

              <div class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealerBet')}</div>
              <input required className="FormControl" type="number" step="1" min="0" bidi={this.welfareTicketDealerBet} />
              <div class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealerBetCut')}{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-dealerBetCut-Help')}</div>
              <input required className="FormControl" type="number" step="1" min="0" bidi={this.welfareTicketDealerBetCut} />

              <div class="welfareTicketSettingsLabel">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-color-background')}</div>
              <div style="display: flex;gap: 10px;">
                <span class="Select" oncreate={this.onColorBackgroundSelectionReady.bind(this)}>
                  <select id="ColorBackgroundSelection" class="Select-input FormControl" buttonclassname="Button" onchange={(e) => this.switchColorBackground(e)}>
                    <option value="background">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-background')}</option>
                    <option value="color">{app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-color')}</option>
                  </select>
                  <i aria-hidden="true" class="icon fas fa-sort Select-caret"></i>
                </span>

                <div id="welfareTicketColorContainer" class="welfareTicketColorAndBackground" style={welfareTicketColorContainerStyle}>
                  <div style="width:10px"></div>
                  <input maxlength="20" placeholder={app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-color-placeholder')} className="FormControl" bidi={this.welfareTicketColor} onchange={() => this.setGuaGuaLeColorPreview()} />
                  <div style="width:5px"></div>
                  <div id="welfareTicketColorPreview" style={welfareTicketColorPreviewStyle}></div>
                </div>

                <div id="welfareTicketBackgroundContainer" class="welfareTicketColorAndBackground" style={welfareTicketBackgroundContainerStyle}>
                  <div style="width:10px"></div>
                  <input maxlength="255" placeholder={app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-background-placeholder')} className="FormControl" bidi={this.welfareTicketImage} onchange={() => this.setGuaGuaLeColorPreview()} />
                  <div id="welfareTicketBackgroundPreview"></div>
                </div>
              </div>

            </div>
          </div>

          <div className="Form-group" style="text-align: center;">
            {Button.component(
              {
                className: 'Button Button--primary',
                type: 'submit',
                loading: this.loading,
              },
              this.settingType==="add"?app.translator.trans('wusong8899-guaguale.admin.guaguale-data-add'):app.translator.trans('wusong8899-guaguale.admin.guaguale-data-save')
            )}&nbsp;
            {Button.component(
              {
                className: 'Button welfareTicketButton--gray',
                loading: this.loading,
                onclick: () => {
                  this.hide();
                }
              },
              app.translator.trans('wusong8899-guaguale.admin.guaguale-data-cancel')
            )}
          </div>

        </div>
      </div>
    );
  }

  switchColorBackground(e){
    //
    const selectElement = e.target;
    const value = selectElement.value;
    
    if(value==="color"){ 
      $("#welfareTicketColorContainer").css("display","");
      $("#welfareTicketBackgroundContainer").css("display","none");
    }else if(value==="background"){
      $("#welfareTicketColorContainer").css("display","none");
      $("#welfareTicketBackgroundContainer").css("display","");
    }
  }

  setGuaGuaLeColorPreview(){
    $("#welfareTicketColorPreview").css("background-color",this.welfareTicketColor());
  }

  precisionRound(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
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

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    const colorBackgroundValue = $("#ColorBackgroundSelection").val();

    if(colorBackgroundValue==="color"){
      this.welfareTicketImage(null)
    }else if(colorBackgroundValue==="background"){
      this.welfareTicketColor(null)
    }

    const settings = JSON.stringify({
      dealerBet: this.welfareTicketDealerBet(),
      dealerBetCut: this.welfareTicketDealerBetCut(),
      win1Multiplier: this.welfareTicketWin1Multiplier,
      win2Multiplier: this.welfareTicketWin2Multiplier,
      win3Multiplier: this.welfareTicketWin3Multiplier,
    });

    if(this.settingType==="edit"){
      this.welfareTicketData.save({
        title:this.welfareTicketTitle(),
        cost:this.welfareTicketCost(),
        type:this.welfareTicketType(),
        color:this.welfareTicketColor(),
        image:this.welfareTicketImage(),
        settings:settings
      })
      .then(
        () => this.hide(),
        (response) => {
          this.loading = false;
          this.handleErrors(response);
        }
      );
    }else{
      app.store
        .createRecord("welfareTicketList")
        .save({
          id:this.welfareTicketID(),
          title:this.welfareTicketTitle(),
          cost:this.welfareTicketCost(),
          type:this.welfareTicketType(),
          color:this.welfareTicketColor(),
          image:this.welfareTicketImage(),
          settings:settings
        })
        .then(
          (guagualeList) => {
            location.reload();
          }
        )
        .catch((e) => {
          this.loading = false;
          this.handleErrors(guagualeList);
        });
    }
  }
}
