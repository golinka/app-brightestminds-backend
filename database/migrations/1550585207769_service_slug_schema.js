/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ServiceSlugSchema extends Schema {
  up() {
    this.alter("services", table => {
      table
        .string("slug", 30)
        .unique()
        .defaultTo(null);
    });
  }

  down() {
    this.alter("services", table => {
      table.dropColumn("slug");
    });
  }
}

module.exports = ServiceSlugSchema;
