CREATE TYPE question_type_enum AS ENUM ('open_ended', 'fill_blank', 'translate');
ALTER TABLE questions ADD COLUMN question_type question_type_enum NOT NULL DEFAULT 'open_ended';
