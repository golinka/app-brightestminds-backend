/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RoleUsersSchema extends Schema {
  up() {
    this.create("role_user", table => {
      table.increments();
      table
        .integer("role_id")
        .unsigned()
        .references("id")
        .inTable("roles")
        .onDelete("cascade")
        .index();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("cascade")
        .index();
      table.timestamps();
    });
  }

  down() {
    this.drop("role_user");
  }
}

module.exports = RoleUsersSchema;
