const User = use("App/Models/User");

class AuthController {
  async login({ request, auth }) {
    const { username, password } = request.all();
    const response = await auth.withRefreshToken().attempt(username, password);
    return User.withDetails(username, response);
  }

  async refresh({ request, auth }) {
    const { refreshToken } = request.all();
    const response = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken);
    return response;
  }
}

module.exports = AuthController;
