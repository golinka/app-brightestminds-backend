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

/* eslint-disable */
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => ({ status: "Ok", version: "1.0.0" }));

Route.group(() => {
  Route.post("/login", "AuthController.login").middleware("guest");

  Route.get("/products", "ProductController.index");
  Route.get("/products/:pid", "ProductController.show");
  Route.get("/products/:pid/buy", "SubscriptionController.buy").middleware("auth");
  Route.post("/products", "ProductController.store").middleware(["auth", "is:admin"]);
  Route.post("/products/:pid", "ProductController.update").middleware(["auth", "is:admin"]);
  Route.delete("/products/:pid", "ProductController.delete").middleware(["auth", "is:admin"]);

  Route.get("/users", "UserController.index").middleware(["auth", "is:admin"]);
  Route.post("/users", "UserController.store");
  Route.get("/users/:uid", "UserController.show").middleware("canSee");
  Route.post("/users/:uid", "UserController.update").middleware("canSee");
  Route.delete("/users/:uid", "UserController.delete").middleware("canSee");
  Route.get("/users/:uid/subscriptions", "UserController.userSubs").middleware("canSee");

  Route.get("/subscriptions", "SubscriptionController.index").middleware(["auth", "is:admin"]);
  Route.get("/subscriptions/:sid", "SubscriptionController.show").middleware(["auth", "is:admin"]);

  Route.get("/services", "ServiceController.index").middleware(["auth", "is:admin"]);
  Route.post("/services", "ServiceController.store").middleware(["auth", "is:admin"]);
  Route.get("/services/:sid", "ServiceController.show").middleware(["auth", "is:admin"]);
  Route.post("/services/:sid", "ServiceController.update").middleware(["auth", "is:admin"]);
  Route.delete("/services/:sid", "ServiceController.delete").middleware(["auth", "is:admin"]);
}).prefix("api/v1");
