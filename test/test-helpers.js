function makeUsersArray() {
  return [
    {
      user_name: "TestUser1",
      user_password: "TestPassword1",
    },
    {
      user_name: "TestUser2",
      user_password: "TestPassword2",
    },
    {
      user_name: "TestUser3",
      user_password: "TestPassword3",
    },
  ];
}

function makeEntriesArray() {
  return [
    {
      date: "1.1.20",
      duration: "1 mins.",
      text: null,
      user_id: 1,
    },
    {
      date: "2.2.20",
      duration: "2 mins.",
      text: null,
      user_id: 2,
    },
  ];
}

module.exports = {
  makeUsersArray,
  makeEntriesArray,
};
