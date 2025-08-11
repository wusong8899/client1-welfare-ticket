import {extend, override} from 'flarum/extend';
import SettingsPage from './components/SettingsPage';
import WelfareTicket from "../forum/model/WelfareTicket";

app.initializers.add('wusong8899-client1-welfare-ticket', () => {
  app.store.models.welfareTicketList = WelfareTicket;
  app.extensionData
    .for('wusong8899-client1-welfare-ticket').registerPage(SettingsPage);
});
