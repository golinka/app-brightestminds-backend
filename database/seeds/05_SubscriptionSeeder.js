/*
|--------------------------------------------------------------------------
| SubscriptionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/
const Subscription = use("App/Models/Subscription");

const User = use("App/Models/User");
const Product = use("App/Models/Product");

class ServiceSeeder {
  async run() {
    await Subscription.query().delete();

    const admin = await User.findBy("username", "admin");
    const subs = await User.findBy("username", "subs");

    const card = {
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 2020,
      cvc: 123
    };

    const { rows: products } = await Product.query()
      .limit(2)
      .fetch();
    await Promise.all(
      products.map((product, index) =>
        Subscription.buy(product.id, card, [admin, subs][index])
      )
    );
  }
}

module.exports = ServiceSeeder;
