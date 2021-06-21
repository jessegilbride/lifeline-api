-- psql -U postgres -d lifelines -f ./seeds/seed.tables.sql

BEGIN;

TRUNCATE TABLE
  line_entries,
  lines,
  users
  RESTART IDENTITY CASCADE;

-- MIGRATION COLUMNS: id, full_name, user_name, password
INSERT INTO users (full_name, user_name, password)
VALUES
  ('Olivia Frederick', 'oliviafrederick', '$2a$12$8f8AREiVHqUkKbBzeJZF7uSmRSS8Zjbenxs3Kchxdo3JS54ZbZnV.'), -- SAm7WzE9 (?)
  ('Emma Blaugh', 'emmablaugh', '$2a$12$eWF4olFzUKFbo0K5sVnKdOUoNeQEh1HbeGCaiUadpzo9e1fDmcHTK'), -- oZLRkxW7 (?)
  ('Isabella Smith', 'isasmith', '$2a$12$f2FwDz9pZsTcR4B5YXYhCuXHAWOsTt8jhJ1UUQZPkuGcRYclaknSy'), -- 7EDHZtgg (?)
  ('Noah Taylor', 'noahtaylor', '$2a$12$V5Q4UH4kZOee2nFlV/212Oyfo3COaWk0uGoXR4riZXob58P7ZAjBS'), -- x7FgNKRt (?)
  ('James Whitlock', 'jwhitlock', '$2a$12$v2W3MQWPe0zCy1I12ScCnOCjYFo2R7En.feLcyvCU38NyjEuK/P9e'); -- swSf5Hti (?)

-- MIGRATION COLUMNS: id, FK:user_id, title, description
INSERT INTO lines (user_id, line_name, description)
VALUES
  (1, 'Timeline 1', 'Line description...'),
  (2, 'Timeline 2', 'Line description...'),
  (3, 'Timeline 3', 'Line description...'),
  (4, 'Timeline 4', 'Line description...'),
  (5, 'Timeline 5', 'Line description...');

-- MIGRATION COLUMNS: id, FK:line_id, title, content, entry_date
INSERT INTO line_entries (line_id, title, content, entry_date)
VALUES
(1, 'entry title', 'entry content', '2021-06-15T15:27:47Z'),
(1, 'entry title', 'entry content', '2021-05-14T15:27:47Z'),
(1, 'entry title', 'entry content', '2021-04-13T15:27:47Z'),

(2, 'entry title', 'entry content', '2021-06-15T15:27:47Z'),
(2, 'entry title', 'entry content', '2021-05-14T15:27:47Z'),
(2, 'entry title', 'entry content', '2021-04-13T15:27:47Z'),

(3, 'entry title', 'entry content', '2021-06-15T15:27:47Z'),
(3, 'entry title', 'entry content', '2021-05-14T15:27:47Z'),
(3, 'entry title', 'entry content', '2021-04-13T15:27:47Z'),

(4, 'entry title', 'entry content', '2021-06-15T15:27:47Z'),
(4, 'entry title', 'entry content', '2021-05-14T15:27:47Z'),
(4, 'entry title', 'entry content', '2021-04-13T15:27:47Z'),

(5, 'entry title', 'entry content', '2021-06-15T15:27:47Z'),
(5, 'entry title', 'entry content', '2021-05-14T15:27:47Z'),
(5, 'entry title', 'entry content', '2021-04-13T15:27:47Z');

COMMIT;
