/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Role = use("App/Models/Role");
const User = use("App/Models/User");

class UserSeeder {
  async run() {
    await User.query().delete();

    const adminRole = await Role.findByOrFail("slug", "admin");
    const subsRole = await Role.findByOrFail("slug", "subs");

    const admin = await User.create({
      username: "admin",
      password: "1234567",
      email: "admin@brightestminds.io",
      fname: "Admin"
    });
    const subs = await User.create({
      username: "subs",
      password: "1234567",
      email: "subs@gmail.com",
      fname: "Jack"
    });
    const subscribers = await Factory.model("App/Models/User").createMany(5);

    await admin.roles().attach([adminRole.id]);
    await subs.roles().attach([subsRole.id]);
    await Promise.all(
      subscribers.map(subscriber => subscriber.roles().attach([subsRole.id]))
    );
  }
}

module.exports = UserSeeder;
