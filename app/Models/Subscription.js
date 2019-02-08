/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Boot = use("./Boot");

class Subscription extends Boot {
  product() {
    return this.belongsTo("App/Models/Product");
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Subscription;
