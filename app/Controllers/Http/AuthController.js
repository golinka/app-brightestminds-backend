const User = use("App/Models/User");

class AuthController {
  async login({ request, auth }) {
    const { username, password } = request.all();
    const response = await auth.attempt(username, password);
    if (typeof response === "object") {
      const user = await User.findByOrFail({ username });
      Object.assign(response, { user });
    }
    return response;
  }
}

module.exports = AuthController;
