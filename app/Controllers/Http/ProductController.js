const Product = use("App/Models/Product");

class ProductController {
  async index({ request }) {
    const { all } = request.get();
    return Product.index(all);
  }

  async show({ params }) {
    const { slug } = params;
    return Product.findByOrFail({ slug });
  }

  async buy({ params, request, auth }) {
    const { pid } = params;
    const user = await auth.getUser();
    const card = request.only(["number", "exp_month", "exp_year", "cvc"]);
    return Product.buy(pid, card, user);
  }

  async store({ request, response }) {
    const data = request.only([
      "title",
      "description",
      "price",
      "interval",
      "is_private",
      "currency"
    ]);
    response.status(201);
    return Product.store(data);
  }

  async update({ request, params }) {
    const { pid } = params;
    const data = request.only([
      "title",
      "description",
      "price",
      "interval",
      "is_private",
      "currency"
    ]);
    return Product.update(pid, data);
  }

  async delete({ params, response }) {
    const { pid } = params;
    const product = await Product.findOrFail(pid);
    await product.delete();
    return response.status(204).send();
  }
}

module.exports = ProductController;
