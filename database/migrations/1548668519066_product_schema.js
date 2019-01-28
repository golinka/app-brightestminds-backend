/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", table => {
      table.increments();
      table.string("title", 255).notNullable();
      table.string("description", 255).notNullable();
      table.integer("price").notNullable();
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
      table
        .boolean("is_private")
        .notNullable()
        .defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;
