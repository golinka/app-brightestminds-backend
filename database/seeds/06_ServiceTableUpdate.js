/*
|--------------------------------------------------------------------------
| ServiceTableUpdate
|--------------------------------------------------------------------------
|
*/

const Database = use("Database");

class ServiceTableUpdate {
  async run() {
    const services = [
      { name: "Campaigns", slug: "woodpecker" },
      { name: "Mailstats", slug: "mailshake" },
      { name: "Timetracker", slug: "toptal" },
      { name: "Timestats", slug: "rescuetime" }
    ];

    await Promise.all(
      services.map(service =>
        Database.table("services")
          .where("name", service.name)
          .update("slug", service.slug)
      )
    );
  }
}

module.exports = ServiceTableUpdate;
