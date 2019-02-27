/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ChangeLengthProductDescriptionSchema extends Schema {
  up() {
    this.alter("products", table => {
      table
        .string("description", 3000)
        .notNullable()
        .defaultTo("")
        .alter();
    });
  }

  down() {
    this.alter("products", table => {
      table
        .string("description", 255)
        .notNullable()
        .defaultTo("")
        .alter();
    });
  }
}

module.exports = ChangeLengthProductDescriptionSchema;
