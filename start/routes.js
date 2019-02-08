/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => ({ status: "Ok", version: "1.0.0" }));

Route.group(() => {
  Route.post("/login", "AuthController.login").middleware("guest");
  Route.get("/logout", "AuthController.logout");

  Route.get("/products", "ProductController.index");
  Route.get("/products/:pid", "ProductController.show");
  Route.get("/products/:pid/buy", "ProductController.buy").middleware("auth");

  Route.post("/users", "UserController.store");
  Route.get("/users/:uid", "UserController.show").middleware("canSee");
  Route.post("/users/:uid", "UserController.update").middleware("canSee");
  Route.delete("/users/:uid", "UserController.delete").middleware("canSee");

  Route.get("/subscriptions/:sid", "SubscriptionController.show").middleware(
    "canSee"
  );
}).prefix("api/v1");

Route.group(() => {
  Route.post("/products", "ProductController.store");
  Route.post("/products/:pid", "ProductController.update");
  Route.delete("/products/:pid", "ProductController.delete");

  Route.get("/users", "UserController.index");

  Route.get("/services", "ServiceController.index");
  Route.post("/services", "ServiceController.store");
  Route.get("/services/:sid", "ServiceController.show");
  Route.post("/services/:sid", "ServiceController.update");
  Route.delete("/services/:sid", "ServiceController.delete");

  Route.get("/subscriptions", "SubscriptionController.index");
})
  .prefix("api/v1")
  .middleware(["auth", "is:admin"]);
