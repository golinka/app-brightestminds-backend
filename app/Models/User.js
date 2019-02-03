/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Boot = use("./Boot");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

class User extends Boot {
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  static get traits() {
    return ["@provider:Adonis/Acl/HasRole"];
  }

  static get hidden() {
    return ["password"];
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }

  services() {
    return this.belongsToMany("App/Models/Service")
      .pivotModel("App/Models/UserService")
      .withPivot(["token"]);
  }

  subscriptions() {
    return this.belongsToMany("App/Models/Product")
      .pivotModel("App/Models/Subscription")
      .withPivot(["status", "payment_date"]);
  }
}

module.exports = User;
