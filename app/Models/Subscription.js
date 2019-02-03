/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Subscription extends Model {
  subscriptions() {
    return this.belongsToMany("App/Models/Product").withPivot(["product_id"]);
  }
}

module.exports = Subscription;
