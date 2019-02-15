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

    const user = await User.findBy({ username });
    const checkPassword = await Hash.verify(password, user.password);

    if (user.username === username && checkPassword) {
      const confirm = await this.confirm(
        "Are you sure you want to delete all test Stripe objects?"
      );

      if (confirm) {
        const { rows: users } = await User.query()
          .whereNotNull("customer")
          .fetch();
        const { rows: products } = await Product.query()
          .whereNotNull("product")
          .fetch();

        const isUserRemoved = await Promise.all(
          users.map(client => User.removeCustomer(client.customer))
        );

        const isProductRemoved = await Promise.all(
          products.map(product =>
            Product.removeProductPlan(product.product, product.plan)
          )
        );

        if (
          !isUserRemoved.includes(false) &&
          !isProductRemoved.includes(false)
        ) {
          this.success(`${this.icon("success")} Success!`);
        } else {
          this.error(
            `${this.icon("error")} Error: some items have not been deleted`
          );
        }
      }
    } else {
      this.warn(
        `${this.icon("error")} Access is denied: Wrong login or password`
      );
    }

    Database.close();
  }
}

module.exports = CleanStripe;
