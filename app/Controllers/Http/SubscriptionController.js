const Subscription = use("App/Models/Subscription");

class SubscriptionController {
  async index() {
    return Subscription.query()
      .with("user")
      .with("product")
      .fetch();
  }

  async buy({ params, request, auth }) {
    const { pid } = params;
    const user = await auth.getUser();
    const card = request.only(["number", "exp_month", "exp_year", "cvc"]);
    return Subscription.buy(pid, card, user);
  }

  async show({ params }) {
    const { sid } = params;
    return Subscription.query()
      .where("id", sid)
      .with("user")
      .with("product")
      .fetch();
  }
}

module.exports = SubscriptionController;
