DROP TABLE IF EXISTS line_entries;

CREATE TABLE line_entries (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  line_id INTEGER REFERENCES lines(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  entry_date TIMESTAMPTZ NOT NULL
);