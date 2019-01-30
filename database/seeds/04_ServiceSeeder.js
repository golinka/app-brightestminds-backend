/*
|--------------------------------------------------------------------------
| ServiceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/
const Chance = require("chance");

const UserService = use("App/Models/UserService");
const Service = use("App/Models/Service");
const User = use("App/Models/User");

class ServiceSeeder {
  async run() {
    await Service.query().delete();
    await UserService.query().delete();

    const chance = new Chance();
    const serviceNames = ["Campaigns", "Mailstats", "Timetracker", "Timestats"];

    const services = await Promise.all(
      serviceNames.map(name => Service.create({ name }))
    );
    const ids = services.map(service => service.id);

    const admin = await User.findBy("username", "admin");
    const subs = await User.findBy("username", "subs");

    await Promise.all(
      [admin, subs].map(user =>
        user.services().attach(ids, row => {
          row.token = chance.apple_token();
        })
      )
    );
  }
}

module.exports = ServiceSeeder;
