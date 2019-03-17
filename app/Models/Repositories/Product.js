const Env = use("Env");
const moment = use("moment");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const StripeException = use("App/Exceptions/StripeException");
const Subscription = use("App/Models/Subscription");
const Product = use("App/Models/Product");

class ProductRepository {
  static index(all) {
    return all
      ? Product.all()
      : Product.query()
          .where("is_private", false)
          .fetch();
  }

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

  static async createProductPlan(data) {
    const { id: productId } = await stripe.products.create({
      name: data.title,
      type: "service",
      metadata: {
        is_private: data.is_private
      }
    });

    const { id: planId } = await stripe.plans.create({
      amount: `${data.price}00`,
      interval: data.interval,
      product: productId,
      currency: data.currency
    });

    return { productId, planId };
  }

  static async store(data) {
    const { productId, planId } = await this.createProductPlan(data);
    return Product.create({
      ...data,
      product: productId,
      plan: planId
    });
  }

  static async update(pid, data) {
    const product = await Product.findOrFail(pid);

    let prodResponse;
    let planResponse;
    try {
      prodResponse = await stripe.products.del(product.product);
      planResponse = await stripe.plans.del(product.plan);
    } catch (err) {
      throw new StripeException(
        "This product cannot be updated because it has one or more plans",
        400
      );
    }

    if (prodResponse.deleted && planResponse.deleted) {
      const { productId, planId } = await this.createProductPlan(data);
      product.merge(data);
      product.merge({
        product: productId,
        plan: planId
      });
      await product.save();
    }

    return product;
  }

  static async removeProductPlan(product, plan) {
    const { productDeleted } = await stripe.plans.del(plan);
    const { planDeleted } = await stripe.products.del(product);
    return productDeleted && planDeleted;
  }
}

module.exports = ProductRepository;
