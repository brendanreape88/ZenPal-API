CREATE TABLE entries (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date TEXT NOT NULL,
    duration TEXT NOT NULL,
    text TEXT,
    user_id INTEGER 
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);