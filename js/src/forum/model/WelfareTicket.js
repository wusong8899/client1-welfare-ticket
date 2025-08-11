import Model from "flarum/Model";

export default class WelfareTicket extends Model {}
Object.assign(WelfareTicket.prototype, {
  id: Model.attribute("id"),
  title: Model.attribute("title"),
  desc: Model.attribute("desc"),
  playback: Model.attribute("playback"),
  color: Model.attribute("color"),
  image: Model.attribute("image"),
  type: Model.attribute("type"),
  cost: Model.attribute("cost"),
  purchased_total: Model.attribute("purchased_total"),
  bet_total: Model.attribute("bet_total"),
  dealer_id: Model.attribute("dealer_id"),
  result: Model.attribute("result"),
  settings: Model.attribute("settings"),
  assignedAt: Model.attribute("assigned_at"),
  activated: Model.attribute("activated"),
  dealerData: Model.hasOne("dealerData"),
});
