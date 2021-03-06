const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { hashPassword } = require("../src/users/users-service");

describe("auth Endpoints", function () {
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
  const testUser = testUsers[0];

  beforeEach("insert users", () => {
    return db.into("users").insert(testUsers);
  });

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
  );

  const requiredFields = ["user_name", "user_password"];

  requiredFields.forEach((field) => {
    const loginAttemptBody = {
      user_name: testUser.user_name,
      user_password: testUser.password,
    };

    it(`responds with 400 required error when '${field}' is missing`, () => {
      delete loginAttemptBody[field];

      return supertest(app)
        .post("/api/users/login")
        .send(loginAttemptBody)
        .expect(400, {
          error: `Missing '${field}' in request body`,
        });
    });
  });

  it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
    const userInvalidUser = { user_name: "user-not", user_password: "existy" };
    return supertest(app)
      .post("/api/users/login")
      .send(userInvalidUser)
      .expect(400, { error: `Incorrect user_name or password` });
  });

  it(`responds 400 'invalid user_name or password' when bad password`, () => {
    const userInvalidPass = {
      user_name: testUser.user_name,
      user_password: "incorrect",
    };
    return supertest(app)
      .post("/api/users/login")
      .send(userInvalidPass)
      .expect(400, { error: `Incorrect user_name or password` });
  });

  it(`responds 200 and JWT users token using secret when valid credentials`, () => {
    //Correct data in userValidCred
    //Correct data in REQ BODY in Auth Router
    //Doesn't trip user not found or passwords don't match
    //How can you progress from here?
    //doesn't the user_password need to be bcrypted?
    const hashedPass = hashPassword(testUser.user_password);
    const userValidCreds = {
      user_name: testUser.user_name,
      user_password: hashedPass,
    };
    const expectedToken = jwt.sign(
      { user_id: testUser.id },
      process.env.JWT_SECRET,
      {
        subject: testUser.user_name,
        algorithm: "HS256",
      }
    );
    return supertest(app)
      .post("/api/users/login")
      .send(userValidCreds)
      .expect(200, {
        authToken: expectedToken,
      });
  });
});
