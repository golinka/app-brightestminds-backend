const Subscription = use("App/Models/Subscription");

class SubscriptionController {
  async index() {
    return Subscription.query()
      .with("user")
      .with("product")
      .fetch();
  }

  async show({ params }) {
    const { sid } = params;
    return Subscription.query()
      .where("id", sid)
      .with("user")
      .with("product")
      .fetch();
  }

  async cancel({ params, response }) {
    const { sid } = params;
    await Subscription.cancel(sid);
    return response.status(204).send();
  }

  async pause({ params, response }) {
    const { sid } = params;
    await Subscription.pause(sid);
    return response.status(204).send();
  }

  async resume({ params, response }) {
    const { sid } = params;
    await Subscription.resume(sid);
    return response.status(204).send();
  }

  async update({ params, request }) {
    const { sid } = params;
    const data = request.only(["item", "anchor", "prorate"]);
    return Subscription.update(sid, data);
  }
}

module.exports = SubscriptionController;
