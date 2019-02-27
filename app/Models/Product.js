/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Boot = use("./Boot");

class Product extends Boot {
  static boot() {
    super.boot();

    this.addTrait("@provider:Lucid/Slugify", {
      fields: {
        slug: "title"
      },
      strategy: "shortId"
    });
  }
}

module.exports = Product;
