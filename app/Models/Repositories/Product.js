const Product = use("App/Models/Product");

class ProductRepository {
  static index(all) {
    return all
      ? Product.all()
      : Product.query()
          .where("is_private", false)
          .fetch();
  }

  static async update(pid, data) {
    const product = await Product.findOrFail(pid);
    await product.merge(data);
    await product.save();
    return product;
  }
}

module.exports = ProductRepository;
