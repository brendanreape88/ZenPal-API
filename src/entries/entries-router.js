const express = require("express");
const path = require("path");
const EntriesService = require("./entries-service");
const { requireAuth } = require("../middleware/jwt-auth");

const entriesRouter = express.Router();
const jsonBodyParser = express.json();

entriesRouter
  .route("/:user_id/entries")
  .all(requireAuth)
  .get((req, res, next) => {
    EntriesService.getEntriesForUser(req.app.get("db"), req.params.user_id)
      .then((entries) => {
        res.json(entries);
      })
      .catch(next);
  });

entriesRouter
  .route("/entries")
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
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
  .route("/entries/:entry_id")
  .all(requireAuth)
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
