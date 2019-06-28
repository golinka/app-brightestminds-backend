const Database = use("Database");
const Hash = use("Hash");
const { Command } = require("@adonisjs/ace");

const User = use("App/Models/User");
const Product = use("App/Models/Product");

class CleanStripe extends Command {
  static get signature() {
    return "clean:local";
  }

  static get description() {
    return "Delete local test data from Stripe";
  }

  async handle(args) {
    const username = args.username || (await this.ask("Enter your username:"));
    const password = args.password || (await this.secure("Password:"));

    let checkPassword;
    try {
      const user = await User.findByOrFail({ username });
      checkPassword = await Hash.verify(password, user.password);
    } catch (e) {
      this.error(`${this.icon("error")} User not defined`);
      Database.close();
      return;
    }

    if (checkPassword) {
      const confirm = args.confirm || (await this.confirm("Are you sure?"));
      if (!confirm) return;

      let usersResult;
      let productsResult;
      try {
        const { rows: users } = await User.query()
          .whereNotNull("customer")
          .fetch();
        usersResult = await Promise.all(
          users.map(client => User.removeCustomer(client.customer))
        );
        this.success(
          `${this.icon("success")} [${
            usersResult.length
          }] customers were deleted!`
        );

        const { rows: products } = await Product.query()
          .whereNotNull("product")
          .fetch();
        productsResult = await Promise.all(
          products.map(product =>
            Product.removeProductPlan(product.product, product.plan)
          )
        );
        this.success(
          `${this.icon("success")} [${
            productsResult.length
          }] products were deleted!`
        );
      } catch (e) {
        this.error(`${this.icon("error")} ${e.message}`);
        Database.close();
        return;
      }
    } else {
      this.error(`${this.icon("error")} Wrong login or password`);
    }

    Database.close();
  }
}

module.exports = CleanStripe;
