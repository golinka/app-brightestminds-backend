const User = use("App/Models/User");

class AuthController {
  async login({ request, auth }) {
    const { username, password } = request.all();
    const response = await auth.withRefreshToken().attempt(username, password);
    if (typeof response === "object") {
      const user = await User.findByOrFail({ username });
      Object.assign(response, { user });
    }
    return response;
  }

  async refresh({ request, auth }) {
    const refreshToken = request.input("refresh_token");
    const response = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken);
    return response;
  }
}

module.exports = AuthController;
