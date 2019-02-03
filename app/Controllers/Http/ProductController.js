const Product = use("App/Models/Product");

class ProductController {
  async index({ request }) {
    const { all } = request.get();
    return Product.index(all);
  }

  async show({ params }) {
    const { pid } = params;
    return Product.findOrFail(pid);
  }

  async store({ request, response }) {
    response.status(201);
    return Product.create(
      request.only(["title", "description", "price", "interval", "is_private"])
    );
  }

  async update({ request, params }) {
    const { pid } = params;
    const data = request.only([
      "title",
      "description",
      "price",
      "interval",
      "is_private"
    ]);
    return Product.update(pid, data);
  }

  async delete({ params, response }) {
    const { pid } = params;
    const product = await Product.findOrFail(pid);
    await product.delete();
    return response.status(204).send();
  }

  async buy({ params, request, auth }) {
    const { pid } = params;
    const user = await auth.getUser();
    const card = request.only(["number", "exp_month", "exp_year", "cvc"]);
    return Product.buy(pid, card, user);
  }
}

module.exports = ProductController;
