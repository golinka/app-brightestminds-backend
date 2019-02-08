const Env = use("Env");
const moment = use("moment");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const Subscription = use("App/Models/Subscription");
const Product = use("App/Models/Product");

class SubscriptionRepository {
  static async buy(pid, card, user) {
    const product = await Product.findOrFail(pid);
    const { id: token } = await stripe.tokens.create({ card });

    /*
    |--------------------------------------------------------------------------
    | Get or create customer
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | Get or create plan
    |--------------------------------------------------------------------------
    */
    let { plan } = product;
    if (!plan) {
      let { product: productId } = product;
      if (!productId) {
        const { id: prodId } = await stripe.products.create({
          name: product.title,
          type: "service",
          metadata: {
            is_private: product.is_private
          }
        });
        productId = prodId;
        product.product = prodId;
        await product.save();
      }

      const { id: planId } = await stripe.plans.create({
        amount: `${product.price}00`,
        interval: product.interval,
        product: productId,
        currency: product.currency
      });

      plan = planId;
      product.plan = planId;
      await product.save();
    }

    /*
    |--------------------------------------------------------------------------
    | Сreate subscription
    |--------------------------------------------------------------------------
    */
    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ plan }]
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
