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
    const { services } = request.only("services");
    return User.update(uid, data, services);
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
}

module.exports = UserController;
