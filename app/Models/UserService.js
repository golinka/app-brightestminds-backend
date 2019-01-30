/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class UserService extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  services() {
    return this.belongsToMany("App/Models/Service").withPivot(["service_id"]);
  }
}

module.exports = UserService;
