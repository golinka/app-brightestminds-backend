/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Boot = use("./Boot");

class Service extends Boot {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Service;
