DROP TABLE IF EXISTS lines;

CREATE TABLE lines (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  line_name TEXT NOT NULL,
  description TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);