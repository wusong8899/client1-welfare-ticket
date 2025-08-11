import Model from "flarum/Model";

export default class WelfareTicketPurchaseSummary extends Model {}
Object.assign(WelfareTicketPurchaseSummary.prototype, {
  betTotal: Model.attribute("betTotal"),
  winTotal: Model.attribute("winTotal")
});
