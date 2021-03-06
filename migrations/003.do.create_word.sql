CREATE TABLE "word" (
  "id" SERIAL PRIMARY KEY,
  "original" TEXT NOT NULL,
  "translation" TEXT NOT NULL,
  "memory_value" SMALLINT DEFAULT 1,
  "correct_count" SMALLINT DEFAULT 0,
  "incorrect_count" SMALLINT DEFAULT 0,
  "language_id" INTEGER REFERENCES "language"(id)
    ON DELETE CASCADE NOT NULL,
  "next" INTEGER REFERENCES "word"(id)
    ON DELETE SET NULL
);

ALTER TABLE "language"
  ADD COLUMN "head" INTEGER REFERENCES "word"(id)
    ON DELETE SET NULL;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'Que', 'What', 2),
  (2, 1, 'Quien', 'Who', 3),
  (3, 1, 'Donde', 'Where', 4),
  (4, 1, 'Por que', 'Why', 5),
  (5, 1, 'Cual', 'Which', 6),
  (6, 1, 'Como', 'How', 7),
  (7, 1, 'Adios', 'Goodbye', 8),
  (8, 1, 'Nunca ', 'Never', 9),
  (9, 1, 'Claro', 'Of course', 10),
  (10, 1,'Siempre', 'Always', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));
