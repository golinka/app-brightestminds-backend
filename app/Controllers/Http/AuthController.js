const User = use("App/Models/User");

class AuthController {
  async login({ request, auth }) {
    const { username, password } = request.all();
    const response = await auth.withRefreshToken().attempt(username, password);
    if (typeof response === "object") {
      const user = await User.findByOrFail({ username });
      const [role] = await user.getRoles();
      Object.assign(response, { user: { ...user, role } });
    }
    return response;
  }

  async refresh({ request, auth }) {
    const refreshToken = request.input("refreshToken");
    const response = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken);
    return response;
  }
}

module.exports = AuthController;
