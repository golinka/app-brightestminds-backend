const Subscription = use("App/Models/Subscription");

class SubscriptionController {
  async index() {
    return Subscription.query()
      .with("user")
      .with("product")
      .fetch();
  }
}

module.exports = SubscriptionController;
