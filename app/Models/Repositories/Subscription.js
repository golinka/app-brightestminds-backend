const Env = use("Env");
const moment = use("moment");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const Subscription = use("App/Models/Subscription");
const Product = use("App/Models/Product");

class SubscriptionRepository {
  static async buy(pid, card, user) {
    const product = await Product.findOrFail(pid);
    const { id: token } = await stripe.tokens.create({ card });

    let { customer } = user;
    if (!customer) {
      const cus = await stripe.customers.create({
        email: user.email,
        description: `${[user.fname, user.lname].join(" ")}(${user.username})`,
        source: token
      });
      customer = cus.id;
      user.customer = cus.id;
      await user.save();
    }

    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ plan: product.plan }]
    });

    return Subscription.create({
      subs_id: subscription.id,
      status: subscription.status,
      payment_date: moment
        .unix(subscription.current_period_end)
        .format("YYYY-MM-DD HH:mm:ssZ"),
      user_id: user.id,
      product_id: pid
    });
  }
}

module.exports = SubscriptionRepository;
