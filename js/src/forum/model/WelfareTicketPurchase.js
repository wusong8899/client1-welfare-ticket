import Model from "flarum/Model";

export default class WelfareTicketPurchase extends Model {}
Object.assign(WelfareTicketPurchase.prototype, {
  id: Model.attribute("id"),
  title: Model.attribute("title"),
  welfare_id: Model.attribute("welfare_id"),
  user_id: Model.attribute("user_id"),
  bet: Model.attribute("bet"),
  multiplier: Model.attribute("multiplier"),
  numbers: Model.attribute("numbers"),
  win_total: Model.attribute("win_total"),
  opened: Model.attribute("opened"),
  assigned_at: Model.attribute("assigned_at"),

  welfareData: Model.hasOne("welfareData"),
});
