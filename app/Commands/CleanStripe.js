const Database = use("Database");
const Hash = use("Hash");
const { Command } = require("@adonisjs/ace");

const User = use("App/Models/User");
const Product = use("App/Models/Product");

class CleanStripe extends Command {
  static get signature() {
    return "clean:stripe";
  }

  static get description() {
    return "Delete all test data from Stripe";
  }

  async handle() {
    const username = await this.ask("Enter your username:");
    const password = await this.secure("Password:");

    let checkPassword = false;

    try {
      const user = await User.findBy({ username });
      checkPassword = await Hash.verify(password, user.password);
    } catch (e) {
      this.error(`${this.icon("error")} User not defined`);
      Database.close();
      return;
    }

    if (checkPassword) {
      const confirm = await this.confirm("Are you sure?");
      if (!confirm) return;

      const { rows: users } = await User.query()
        .whereNotNull("customer")
        .fetch();
      const usersResult = await Promise.all(
        users.map(client => User.removeCustomer(client.customer))
      );

      const { rows: products } = await Product.query()
        .whereNotNull("product")
        .fetch();
      const productsResult = await Promise.all(
        products.map(product =>
          Product.removeProductPlan(product.product, product.plan)
        )
      );

      /* eslint-disable */
      if (!usersResult.includes(false) && !productsResult.includes(false)) {
        this.success(`${this.icon("success")} [${usersResult.length}] customers were deleted!`);
        this.success(`${this.icon("success")} [${productsResult.length}] products were deleted!`);
      } else {
        this.warn(`${this.icon("warn")} Not all entities have been deleted:
          ${users.length > usersResult.length ? '\n[${usersResult.length}] customers <<<' : ''}
          ${products.length > productsResult.length ? '\n[${productsResult.length}] products <<<' : ''}
        `);
      }
      /* eslint-enable */
    } else {
      this.error(`${this.icon("error")} Wrong login or password`);
    }

    Database.close();
  }
}

module.exports = CleanStripe;
