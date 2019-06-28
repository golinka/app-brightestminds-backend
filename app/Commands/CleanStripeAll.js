const { Command } = require("@adonisjs/ace");

const Env = use("Env");
const Database = use("Database");
const stripe = require("stripe")(Env.getOrFail("STRIPE_SECRET_KEY"));

async function deleteEntity(entity, limit) {
  let entityList;
  try {
    entityList = await stripe[entity].list({ limit });
  } catch (e) {
    this.error(`${this.icon("error")} ${e.message}`);
  }

  const ids = entityList.data.map(item => item.id);
  const result = await Promise.all(
    ids.map(id =>
      stripe[entity]
        .del(id)
        .then(({ deleted }) => deleted)
        .catch(e => this.error(`${this.icon("error")} ${e.message}`))
    )
  );

  /* eslint-disable */
  const capitalizeEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
  !result.includes(false)
    ? this.success(`${this.icon("success")} ${capitalizeEntity}: Success [${result.length}]`)
    : this.warn(`${this.icon("warn")} Warning: not all ${entity} have been deleted`);
  /* eslint-enable */
}

class CleanStripeAll extends Command {
  static get signature() {
    return "clean:all";
  }

  static get description() {
    return "Delete all Stripe test data";
  }

  async handle() {
    const confirm = await this.confirm(
      "Are you sure you want to delete all Stripe test data?"
    );

    if (confirm) {
      const limit = 100;
      const entities = ["customers", "plans", "products"];
      await Promise.all(
        entities.map(entity => deleteEntity.call(this, entity, limit))
      );
    }

    Database.close();
  }
}

module.exports = CleanStripeAll;
