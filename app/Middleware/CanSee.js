/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class MyAccount {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ params, auth }, next) {
    const { uid } = params;
    const user = await auth.getUser();

    const userRoles = await user.getRoles();
    const isAdmin = userRoles.includes("admin");

    if (Number(uid) !== user.id && !isAdmin) {
      const error = new Error("You doesn't have access to this information.");
      error.status = 403;
      throw error;
    }

    await next();
  }
}

module.exports = MyAccount;
