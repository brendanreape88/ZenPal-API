# ZenPal API

**Live:** https://serene-headland-01136.herokuapp.com/

**Endpoint:** https://serene-headland-01136.herokuapp.com/api/users

### Register:

Send a POST request to "/" to register as a new user.

{
"user_name": "exampleuser1",
"user_password": "examplepassword1"
}

---

### Log In:

Send a POST request to "/login" to log in.

{
"user_name": "exampleuser1",
"user_password": "examplepassword1"
}

---

### Journal Entries:

Please note that every journal entry endpoint requires you to send your auth token!

Send a GET request to "/:user_id/entries" to get all of of the journal entries for a particular user.

Send a POST request to "/entries" to post a new journal entry to the database.

{
"date": "Enter a date as a string in M/D/Y format",
"duration": "Enter the length of your meditation as a string",
"text": "This is the text for your journal entry"
"user_id": "This should be a number"
}

Send a PUT request to "/entries/:entry_id" to modify the text of a journal entry.

{
"text": "Your new journal entry text"
}

Send a DELETE request to "entries/:entry_id" to delete a particular journal entry.
