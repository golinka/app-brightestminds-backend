class AuthController {
  async login({ request, auth }) {
    const { username, password } = request.all();
    return auth.attempt(username, password);
  }
}

module.exports = AuthController;
