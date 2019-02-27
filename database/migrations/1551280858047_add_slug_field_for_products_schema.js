/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddSlugFieldForProductsSchema extends Schema {
  up() {
    this.alter("products", table => {
      table
        .string("slug", 270)
        .notNullable()
        .defaultTo("");
    });
  }

  down() {
    this.alter("products", table => {
      table.dropColumn("slug");
    });
  }
}

module.exports = AddSlugFieldForProductsSchema;
