/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserServiceSchema extends Schema {
  up() {
    this.create("user_services", table => {
      table.increments();
      table
        .string("token", 255)
        .notNullable()
        .unique()
        .index();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("cascade")
        .index();
      table
        .integer("service_id")
        .unsigned()
        .references("id")
        .inTable("services")
        .onDelete("cascade")
        .index();
    });
  }

  down() {
    this.drop("user_services");
  }
}

module.exports = UserServiceSchema;
