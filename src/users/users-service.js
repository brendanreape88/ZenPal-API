const UsersService = {
  getAllUsers(db) {
    return db.from("users").select("*");
  },
  insertUser(db, newUser) {
    return db.insert(newUser).into("users");
  },
};

module.exports = UsersService;
