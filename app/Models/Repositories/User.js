const Env = use("Env");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const User = use("App/Models/User");

class UserRepository {
  static async withDetails(username, response) {
    if (typeof response === "object") {
      const user = await User.findByOrFail({ username });
      const [role] = await user.getRoles();
      Object.assign(user, { role });
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

  static async update(uid, data, services) {
    const user = await User.findOrFail(uid);
    user.merge(data);
    await user.save();

    const ids = Object.keys(services).filter(
      id => typeof services[id] !== "undefined"
    );

    await user.services().sync(ids, row => {
      row.token = services[row.service_id];
    });

    return this.show(uid);
  }

  static async removeCustomer(customer) {
    const { deleted } = await stripe.customers.del(customer);
    return deleted;
  }
}

module.exports = UserRepository;
