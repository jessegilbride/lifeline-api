-- psql -U postgres -d lifelines -f ./seeds/trunc.tables.sql

TRUNCATE
  line_entries,
  lines,
  users
  RESTART IDENTITY CASCADE;
