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
    const { productId, planId } = this.createProductPlan(data);
    return Product.create({
      ...data,
      product: productId,
      plan: planId
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
