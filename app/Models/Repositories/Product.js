const Env = use("Env");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const Product = use("App/Models/Product");

class ProductRepository {
  static index(all) {
    return all
      ? Product.all()
      : Product.query()
          .where("is_private", false)
          .fetch();
  }

  static async store(data) {
    const { id: stripeProductId } = await stripe.products.create({
      name: data.title,
      type: "service",
      metadata: {
        is_private: data.is_private
      }
    });

    const { id: stripePlanId } = await stripe.plans.create({
      amount: `${data.price}00`,
      interval: data.interval,
      product: stripeProductId,
      currency: data.currency
    });

    return Product.create({
      ...data,
      product: stripeProductId,
      plan: stripePlanId
    });
  }

  static async update(pid, data) {
    const product = await Product.findOrFail(pid);
    await product.merge(data);
    await product.save();
    return product;
  }
}

module.exports = ProductRepository;
