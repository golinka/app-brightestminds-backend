/*
|--------------------------------------------------------------------------
| Vow file
|--------------------------------------------------------------------------
|
| The vow file is loaded before running your tests. This is the best place
| to hook operations `before` and `after` running the tests.
|
*/

// Uncomment when want to run migrations
const ace = require("@adonisjs/ace");

module.exports = (cli, runner) => {
  runner.before(async () => {
    /*
    |--------------------------------------------------------------------------
    | Start the server
    |--------------------------------------------------------------------------
    |
    | Starts the http server before running the tests. You can comment this
    | line, if http server is not required
    |
    */
    use("Adonis/Src/Server").listen(process.env.HOST, process.env.PORT);

    /*
    |--------------------------------------------------------------------------
    | Run migrations
    |--------------------------------------------------------------------------
    |
    | Migrate the database before starting the tests.
    |
    */
    await ace.call("migration:run");
    await ace.call("seed", {}, {});
  });

  runner.after(async () => {
    /*
    |--------------------------------------------------------------------------
    | Delete Stripe test data
    |--------------------------------------------------------------------------
    |
    | Delete Stripe test data before data is deleted
    |
    */
    await ace.call("clean:local", {
      username: "admin",
      password: "1234567",
      confirm: true
    });

    /*
    |--------------------------------------------------------------------------
    | Rollback migrations
    |--------------------------------------------------------------------------
    |
    | Once all tests have been completed, we should reset the database to it's
    | original state
    |
    */
    await ace.call("migration:reset", {}, {});

    /*
    |--------------------------------------------------------------------------
    | Shutdown server
    |--------------------------------------------------------------------------
    |
    | Shutdown the HTTP server when all tests have been executed.
    |
    */
    use("Adonis/Src/Server")
      .getInstance()
      .close();
  });
};
