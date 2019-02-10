/*
|--------------------------------------------------------------------------
| ProductSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Product = use("App/Models/Product");

class ProductSeeder {
  async run() {
    await Product.query().delete();

    const products = await Factory.model("App/Models/Product").makeMany(5);
    const idsArray = await Promise.all(
      products.map(product => Product.createProductPlan(product))
    );

    await Promise.all(
      idsArray.map((ids, index) => {
        products[index].merge({ product: ids.productId, plan: ids.planId });
        return products[index].save();
      })
    );
  }
}

module.exports = ProductSeeder;
