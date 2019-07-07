const get = require("lodash/get");

const Factory = use("Factory");
const { test, trait } = use("Test/Suite")("Auth Challenge");

trait("Test/ApiClient");
trait("Auth/Client");

test("check user login", async ({ assert, client }) => {
  const { id, username } = await Factory.model("App/Models/User").create({
    password: "1234567"
  });

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "1234567" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({ user: { id, username } });
  assert.isString(get(response, ["body", "token"], null));
  assert.isString(get(response, ["body", "refreshToken"], null));
});

test("check token refresh", async ({ assert, client }) => {
  const { username } = await Factory.model("App/Models/User").create({
    password: "1234567"
  });

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "1234567" })
    .end();

  const refreshResponse = await client
    .post("/api/v1/refresh")
    .send({ refreshToken: response.body.refreshToken })
    .end();

  refreshResponse.assertStatus(200);
  assert.isString(get(refreshResponse, ["body", "token"], null));
  assert.isString(get(refreshResponse, ["body", "refreshToken"], null));
});
