/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SubscriptionsSchema extends Schema {
  up() {
    this.alter("users", table => {
      table
        .string("customer", 255)
        .unique()
        .defaultTo(null);
    });

    this.alter("products", table => {
      table
        .string("product", 255)
        .unique()
        .defaultTo(null);
      table
        .string("plan", 255)
        .unique()
        .defaultTo(null);
      table.dropColumn("period");
      table
        .enu("interval", ["day", "week", "month", "year"])
        .defaultTo("month")
        .notNullable();
      table
        .enu("currency", ["usd", "eur"])
        .defaultTo("eur")
        .notNullable();
    });

    this.create("subscriptions", table => {
      table.increments();
      table
        .string("subs_id", 255)
        .unique()
        .notNullable();
      table.string("status", 30);
      table.datetime("payment_date");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("cascade")
        .index();
      table
        .integer("product_id")
        .unsigned()
        .references("id")
        .inTable("products")
        .onDelete("cascade")
        .index();
      table.timestamps();
    });
  }

  down() {
    this.alter("users", table => {
      table.dropColumn("customer");
    });

    this.alter("products", table => {
      table.dropColumn("product");
      table.dropColumn("plan");
      table.dropColumn("interval");
      table.dropColumn("currency");
      table
        .enu("period", [
          "Daily",
          "Weekly",
          "Monthly",
          "Every 3 months",
          "Every 6 months",
          "Yearly"
        ])
        .defaultTo("Monthly")
        .notNullable();
    });

    this.drop("subscriptions");
  }
}

module.exports = SubscriptionsSchema;
