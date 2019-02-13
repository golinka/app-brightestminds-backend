const Subscription = use("App/Models/Subscription");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class SubscriptionAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ params, auth }, next) {
    const { sid } = params;
    const user = await auth.getUser();

    const userRoles = await user.getRoles();
    const { user_id: userId } = await Subscription.findOrFail(sid);

    if (userId !== user.id && !userRoles.includes("admin")) {
      const error = new Error("You don't have access to do this");
      error.status = 403;
      throw error;
    }

    await next();
  }
}

module.exports = SubscriptionAccess;
