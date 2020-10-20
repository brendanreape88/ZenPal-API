const bcrypt = require("bcryptjs");
const xss = require("xss");

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db("users")
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hashSync(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
    };
  },
};

module.exports = UsersService;
