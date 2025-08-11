import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class WelfareTicketDeleteModal extends Modal {
  static isDismissible = false;

  oninit(vnode) {
    super.oninit(vnode);
    this.welfareTicketData = this.attrs.welfareTicketData;
    this.loading = false;
  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('wusong8899-welfare-ticket.admin.welfare-item-delete-confirmation');
  }

  content() {
    //

    return (
      <div className="Modal-body">
        <div className="Form-group" style="text-align: center;">
          {Button.component(
            {
              className: 'Button Button--primary',
              type: 'submit',
              loading: this.loading,
            },
            app.translator.trans('wusong8899-welfare-ticket.admin.welfare-data-confirm')
          )}&nbsp;
          {Button.component(
            {
              className: 'Button welfareTicketButton--gray',
              loading: this.loading,
              onclick: () => {
                this.hide();
              }
            },
            app.translator.trans('wusong8899-welfare-ticket.admin.welfare-data-cancel')
          )}
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    this.welfareTicketData.save({
      activated:2,
    })
    .then(
      () => location.reload(),
      (response) => {
        this.loading = false;
        this.handleErrors(response);
      }
    );
  }
}
