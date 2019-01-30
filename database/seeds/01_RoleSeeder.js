/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Role = use("App/Models/Role");

class RoleSeeder {
  async run() {
    await Role.query().delete();

    const roles = [
      {
        name: "Subscriber",
        slug: "subs",
        description: "Buys a product, subscribes to subscriptions"
      },
      { name: "Admin", slug: "admin", description: "Super user" }
    ];

    await Role.createMany(roles);
  }
}

module.exports = RoleSeeder;
