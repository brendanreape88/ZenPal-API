const EntriesService = {
  getEntriesForUser(db, user_id) {
    return db.from("entries").select("*").where("user_id", user_id);
  },

  insertEntry(db, newEntry) {
    return db.insert(newEntry).into("entries").returning("*");
  },

  getEntryById(db, entry_id) {
    return db.from("entries").select("*").where("entries.id", entry_id);
  },

  addEntryText(db, entry_id, textForEntry) {
    return db
      .from("entries")
      .where("entries.id", entry_id)
      .update("text", textForEntry)
      .returning("*");
  },

  deleteEntryById(db, entry_id) {
    return db.from("entries").where("entries.id", entry_id).del();
  },
};

module.exports = EntriesService;
