const Validator = use("Validator");
const UserService = use("App/Models/UserService");

const uniqueTokenFn = async ({ uid, sid, token }, field, message) => {
  const { token: currentToken } = await UserService.findByOrFail({
    user_id: uid,
    service_id: sid
  });
  if (token === currentToken) return;

  const { rows: tokens } = await UserService.query()
    .select("token")
    .fetch();
  tokens.forEach(({ token: otherToken }) => {
    if (token === otherToken) throw new Error(message);
  });
};

Validator.extend("uniqueToken", uniqueTokenFn);

class CheckServices {
  get rules() {
    return {
      token: "required|uniqueToken|max:255"
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required",
      uniqueToken: "{{ field }} must be unique",
      "token.max": "{{ field }} must be at maximum 255 characters"
    };
  }

  get data() {
    const body = this.ctx.request.all();
    const { uid, sid } = this.ctx.params;
    return Object.assign({}, body, { uid, sid });
  }
}

module.exports = CheckServices;
