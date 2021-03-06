const Env = use("Env");
const moment = use("moment");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const Subscription = use("App/Models/Subscription");
const Product = use("App/Models/Product");
const User = use("App/Models/User");

class SubscriptionRepository {
  static async changeStatusSubscription(sid, status) {
    const subscription = await Subscription.findOrFail(sid);
    await stripe.subscriptions.del(subscription.subs_id);
    subscription.status = status;
    return subscription.save();
  }

  static cancel(sid) {
    return this.changeStatusSubscription(sid, "canceled");
  }

  static pause(sid) {
    return this.changeStatusSubscription(sid, "paused");
  }

  static async resume(sid) {
    const pausedSubscription = await Subscription.findOrFail(sid);
    const { customer } = await User.findOrFail(pausedSubscription.user_id);
    const product = await Product.findOrFail(pausedSubscription.product_id);

    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ plan: product.plan }]
    });

    pausedSubscription.merge({
      subs_id: subscription.id,
      status: subscription.status,
      payment_date: moment
        .unix(subscription.current_period_end)
        .format("YYYY-MM-DD HH:mm:ssZ")
    });
    await pausedSubscription.save();

    return subscription;
  }

  static async update(sid, data) {
    const { item, anchor, prorate } = data;
    const subscription = await Subscription.findOrFail(sid);
    const { plan } = await Product.query()
      .where("id", Number(item))
      .firstOrFail();

    await stripe.subscriptions.update(subscription.subs_id, {
      items: [{ plan }],
      billing_cycle_anchor: anchor,
      prorate
    });

    subscription.product_id = item;
    await subscription.save();

    return subscription;
  }
}

module.exports = SubscriptionRepository;
