const User = use("App/Models/User");
const Subscription = use("App/Models/Subscription");

class UserController {
  async index() {
    return User.all();
  }

  async store({ request, response }) {
    const data = request.only([
      "username",
      "email",
      "password",
      "fname",
      "lname",
      "phone",
      "company"
    ]);
    response.status(201);
    return User.create(data);
  }

  async show({ params }) {
    const { uid } = params;
    return User.show(uid);
  }

  async showMe({ auth }) {
    const user = await auth.getUser();
    const [role] = await user.getRoles();
    return { ...user.toJSON(), role };
  }

  async update({ params, request }) {
    const { uid } = params;
    const data = request.only([
      "username",
      "email",
      "password",
      "fname",
      "lname",
      "phone",
      "company"
    ]);
    return User.update(uid, data);
  }

  async delete({ params, response }) {
    const { uid } = params;
    const user = await User.findOrFail(uid);
    await user.delete();
    return response.status(204).send();
  }

  async userSubs({ params }) {
    const { uid } = params;
    return Subscription.query()
      .where("user_id", uid)
      .with("product")
      .fetch();
  }

  async updateService({ params, request }) {
    const { uid, sid } = params;
    const { token } = request.only("token");
    return User.updateService(uid, sid, token);
  }
}

module.exports = UserController;
