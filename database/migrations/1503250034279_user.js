/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table
        .string("username", 80)
        .notNullable()
        .unique();
      table
        .string("email", 255)
        .notNullable()
        .unique();
      table.string("password", 60).notNullable();
      table.string("fname", 35).notNullable();
      table.string("lname", 45);
      table.string("phone", 25);
      table.string("company", 150);
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
