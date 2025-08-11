import Model from "flarum/Model";

export default class WelfareTicketPurchaseCount extends Model {}
Object.assign(WelfareTicketPurchaseCount.prototype, {
  total_purchase_count: Model.attribute("total_purchase_count"),
  total_win_count: Model.attribute("total_win_count"),
});
