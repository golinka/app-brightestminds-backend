const Validator = use("Validator");
const Subscription = use("App/Models/Subscription");

const itemsFn = async (data, field, message) => {
  const { item, sid } = data;
  const subs = await Subscription.findOrFail(sid);
  if (Number(item) === subs.product_id) throw message;
};

Validator.extend("items", itemsFn);

class CheckSubs {
  get rules() {
    return {
      item: "required|integer|items",
      anchor: "in:now,unchanged",
      prorate: "in:true,false"
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required",
      integer: "{{ field }} must include only digits",
      "item.items": "{{ field }} cannot change to item with the same plan",
      "anchor.in":
        "{{ field }} must be one with these values: 'now', 'unchanged'",
      "prorate.in": "{{ field }} must be one with these values: 'true', 'false'"
    };
  }

  get data() {
    const body = this.ctx.request.all();
    const { sid } = this.ctx.params;
    return Object.assign({}, body, { sid });
  }
}

module.exports = CheckSubs;
