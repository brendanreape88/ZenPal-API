const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");

describe("Entries Endpoints", function () {
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
    db("entries")
      .truncate()
      .then(() => db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
  );

  const testUsers = helpers.makeUsersArray();
  const testEntries = helpers.makeEntriesArray();

  beforeEach("insert entries", () => {
    return db
      .into("users")
      .insert(testUsers)
      .then(() => db.into("entries").insert(testEntries));
  });

  afterEach("cleanup", () =>
    db("entries")
      .truncate()
      .then(() => db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
  );

  describe(`GET /api/user/:user_id/entries`, () => {
    context(`Given there are no entries for the user`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get(`/api/users/3/entries`).expect(200, []);
      });
    });

    context(`Given there are entries for the user`, () => {
      it.only(`responds with 200 and the list of entries`, () => {
        const testEntriesForUser1 = [
          {
            date: "1.1.20",
            duration: "1 mins.",
            id: 1,
            text: null,
            user_id: 1,
          },
        ];
        return supertest(app)
          .get(`/api/users/1/entries`)
          .expect(200, testEntriesForUser1);
      });
    });
  });

  describe(`POST /api/users/entries`, () => {
    context(`Given the user posts their entry`, () => {
      it(`responds with 201 and the new entry`, () => {
        const newTestEntry = {
          id: 3,
          date: "3.3.20",
          duration: "3 mins.",
          text: null,
          user_id: 3,
        };
        return supertest(app)
          .post(`/api/users/entries`)
          .send(newTestEntry)
          .expect(201, [newTestEntry]);
      });
    });
  });

  describe(`PUT /api/users/entries/:entry_id`, () => {
    context(`Given the user adds text to their entry`, () => {
      it(`responds with 200 and the updated entry`, () => {
        const newTextForEntry = {
          text: "Here's a test journal entry!",
        };
        const updatedEntry = {
          id: 2,
          date: "2.2.20",
          duration: "2 mins.",
          text: "Here's a test journal entry!",
          user_id: 2,
        };
        return supertest(app)
          .put(`/api/users/entries/2/`)
          .send(newTextForEntry)
          .expect(200, [updatedEntry]);
      });
    });
    context(`Given the user deletes the entry`, () => {
      it(`responds with 200`, () => {
        return supertest(app).delete(`/api/users/entries/2/`).expect(200);
      });
    });
  });
});
