const Env = use("Env");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const StripeException = use("App/Exceptions/StripeException");
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
