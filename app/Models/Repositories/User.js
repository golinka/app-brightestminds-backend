const User = use("App/Models/User");

class UserRepository {
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
}

module.exports = UserRepository;
