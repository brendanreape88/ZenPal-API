const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");

describe("Users Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
  );

  const testUsers = helpers.makeUsersArray();

  beforeEach("insert users", () => {
    return db.into("users").insert(testUsers);
  });

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
  );

  context(`Given users submits valid user_name and user_password`, () => {
    it(`responds with 201 and the new user`, () => {
      const newUser = {
        user_name: "TestUser4",
        user_password: "TestPassword4",
      };
      return supertest(app)
        .post(`/api/users`)
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
          expect(res.body.user_name).to.eql(newUser.user_name);
          expect(res.body).to.not.have.property("user_password");
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
        });
    });
  });
});
