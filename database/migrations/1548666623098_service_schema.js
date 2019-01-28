/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ServiceSchema extends Schema {
  up() {
    this.create("services", table => {
      table.increments();
      table
        .string("name", 40)
        .notNullable()
        .unique();
    });
  }

  down() {
    this.drop("services");
  }
}

module.exports = ServiceSchema;
