const express = require("express");
const path = require("path");
const EntriesService = require("./entries-service");

const entriesRouter = express.Router();
const jsonBodyParser = express.json();

entriesRouter.route("/users/:user_id/entries").get((req, res, next) => {
  EntriesService.getEntriesForUser(req.app.get("db"), req.params.user_id)
    .then((entries) => {
      res.json(entries);
    })
    .catch(next);
});

entriesRouter.route("/users/entries").post(jsonBodyParser, (req, res, next) => {
  const { date, duration, text, user_id } = req.body;
  const newEntry = { date, duration, text, user_id };

  EntriesService.insertEntry(req.app.get("db"), newEntry)
    .then((entry) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${entry.id}`))
        .json(entry);
    })
    .catch(next);
});

entriesRouter
  .route("/users/entries/:entry_id")
  .get((req, res, next) => {
    EntriesService.getEntryById(req.app.get("db"), req.params.entry_id)
      .then((entry) => {
        res.json(entry);
      })
      .catch(next);
  })
  .put(jsonBodyParser, (req, res, next) => {
    const { text } = req.body;
    const textForEntry = text;

    EntriesService.addEntryText(
      req.app.get("db"),
      req.params.entry_id,
      textForEntry
    )
      .then((entry) => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl, `/${entry.id}`))
          .json(entry);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    EntriesService.deleteEntryById(req.app.get("db"), req.params.entry_id)
      .then(() => {
        res.status(200).end();
      })
      .catch(next);
  });

module.exports = entriesRouter;
