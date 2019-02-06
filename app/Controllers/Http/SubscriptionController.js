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
}

module.exports = SubscriptionController;
