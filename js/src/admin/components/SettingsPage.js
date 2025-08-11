import ExtensionPage from 'flarum/components/ExtensionPage';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Button from 'flarum/components/Button';
import WelfareTicketSettingsAddModal from './WelfareTicketSettingsAddModal';
import WelfareTicketSettingsListItem from './WelfareTicketSettingsListItem';

export default class SettingsPage extends ExtensionPage {
  oninit(attrs) {
    super.oninit(attrs);
    this.loading_welfare = true;
    this.welfareTicketList = [];
    this.loadResults();
  }

  content() {
    let loading_welfare;

    if(this.loading_welfare){
      loading_welfare = LoadingIndicator.component({ size: "large" });
    }

    return (
      <div className="ExtensionPage-settings FlarumBadgesPage">
        <div className="container">
          {this.buildSettingComponent({
            type: 'string',
            setting: 'wusong8899-welfare-ticket.welfareDisplayName',
            label: app.translator.trans('wusong8899-welfare-ticket.admin.settings.welfare-display-name'),
            placeholder:app.translator.trans('wusong8899-welfare-ticket.admin.settings.welfare-display-name-default')
          })}

          {this.buildSettingComponent({
            type: 'string',
            setting: 'wusong8899-welfare-ticket.welfareTimezone',
            label: app.translator.trans('wusong8899-welfare-ticket.admin.settings.welfare-timezone'),
            help: app.translator.trans('wusong8899-welfare-ticket.admin.settings.welfare-timezone-help'),
            placeholder:app.translator.trans('wusong8899-welfare-ticket.admin.settings.welfare-timezone-default')
          })}

          <div className="Form-group">{this.submitButton()}</div>

          <div style="padding-bottom:10px">
            <Button className={'Button'} onclick={() => app.modal.show(WelfareTicketSettingsAddModal)}>
              {app.translator.trans('wusong8899-welfare-ticket.admin.welfare-add')}
            </Button>
          </div>

          <div style="padding:10px 0px 20px 0px">
            {this.welfareTicketList.map((welfareTicketData) => {
              return (
                <div style="padding-top:5px">
                  {WelfareTicketSettingsListItem.component({ welfareTicketData })}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  parseResults(results) {
    [].push.apply(this.welfareTicketList, results);
    this.loading_welfare = false;
    m.redraw();
    return results;
  }

  loadResults() {
    const filter = {
      item:"all"
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
}
