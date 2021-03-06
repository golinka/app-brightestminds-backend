/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

Factory.blueprint("App/Models/User", (faker, index, data) => {
  return {
    username: data.username || faker.username(),
    email: data.email || faker.email({ domain: "brightestminds.io" }),
    password: data.password || faker.password(),
    fname: data.fname || faker.first(),
    lname: data.lname || faker.last(),
    phone: data.phone || faker.phone(),
    company: data.company || faker.company()
  };
});

Factory.blueprint("App/Models/Product", (faker, index, data) => {
  const description = [];
  for (let i = 0; i < 10; i += 1)
    description.push(faker.sentence({ words: 5 }));
  return {
    title: data.title || faker.sentence({ words: 5 }),
    description: data.description || description.join("\n"),
    price: data.price || faker.integer({ min: 500, max: 3000 }),
    interval: data.interval || "week",
    currency: data.currency || "eur",
    is_private: data.is_private || faker.pick([true, false])
  };
});
