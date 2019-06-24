const Env = use("Env");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

const User = use("App/Models/User");
const UserService = use("App/Models/UserService");

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

  static async updateService(uid, sid, token) {
    const service = await UserService.findByOrFail({
      user_id: uid,
      service_id: sid
    });
    service.token = token;
    await service.save();
    return service;
  }

  static async removeCustomer(customer) {
    const { deleted } = await stripe.customers.del(customer);
    return deleted;
  }
}

module.exports = UserRepository;
