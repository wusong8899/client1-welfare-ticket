import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

export default class WelfareTicketDealerSuccessModal extends Modal {
  static isDismissible = false;

  oninit(vnode) {
    super.oninit(vnode);
  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-dealer-success');
  }

  content() {
    return [
      <div className="Modal-body">
        <div style="text-align:center">
            {Button.component({
                style:'width:66px',
                className: 'Button Button--primary',
                onclick: () => {
                  location.reload();
                }
              },
              app.translator.trans('wusong8899-welfare-ticket.forum.welfare-purchase-ok')
            )}
          </div>
      </div>,
    ];
  }
}