const Env = use("Env");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const User = use("App/Models/User");

class UserRepository {
  static async withDetails(username, response) {
    if (typeof response === "object") {
      const user = await User.findByOrFail({ username });
      const [role] = await user.getRoles();
      const { rows: services } = await user.services().fetch();
      Object.assign(user, { role, services });
      Object.assign(response, { user });
    }
    return response;
  }

  static async show(uid) {
    return User.query()
      .where("id", uid)
      .with("services")
      .fetch();
  }

  static async update(uid, data) {
    const user = await User.findOrFail(uid);
    user.merge(data);
    await user.save();
    return this.show(uid);
  }

  static async updateServices(uid, services) {
    const user = await User.findOrFail(uid);
    const serviceData = JSON.parse(services);
    const ids = serviceData.map(service => service.id);
    await user.services().sync(ids, row => {
      row.token = serviceData[row.service_id].token;
    });
    return this.show(uid);
  }

  static async removeCustomer(customer) {
    const { deleted } = await stripe.customers.del(customer);
    return deleted;
  }
}

module.exports = UserRepository;
