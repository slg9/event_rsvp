CREATE TYPE "role" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "attending_types" AS ENUM ('oui', 'non');
CREATE TYPE "answer_types" AS ENUM ('STRING' , 'STRING[]' , 'NUMBER' , 'NUMBER[] ', 'BOOLEAN');

CREATE TABLE "users"(
    "id" uuid primary key default (gen_random_uuid()),
    "created_at" timestamp NOT NULL DEFAULT (NOW()),
    "updated_at" timestamp NOT NULL DEFAULT (NOW()),
    "deleted_at" timestamp,
    "firstname" text NOT NULL,
    "lastname" text NOT NULL,
    "email" text NOT NULL,
    "password" text NOT NULL,
    "role" role NOT NULL,
    "last_login" timestamp
);

CREATE TABLE "events"(
    "id" uuid primary key default (gen_random_uuid()),
    "created_at" timestamp NOT NULL DEFAULT (NOW()),
    "updated_at" timestamp NOT NULL DEFAULT (NOW()),
    "deleted_at" timestamp,
    "user_id" uuid NOT NULL REFERENCES "users" ("id"),
    "name" text NOT NULL,
    "start" date NOT NULL,
    "end" date NOT NULL,
    "code" text NOT NULL,
    "canva_url" text
);

CREATE TABLE "questions"(
    "id" uuid primary key default (gen_random_uuid()),
    "created_at" timestamp NOT NULL DEFAULT (NOW()),
    "updated_at" timestamp NOT NULL DEFAULT (NOW()),
    "deleted_at" timestamp,
    "event_id" uuid NOT NULL REFERENCES "events" ("id"),
    "name" text NOT NULL,
    "description" text NOT NULL,
    "answer_type" answer_types NOT NULL
);

CREATE TABLE "attendees"(
    "id" uuid primary key default (gen_random_uuid()),
    "created_at" timestamp NOT NULL DEFAULT (NOW()),
    "updated_at" timestamp NOT NULL DEFAULT (NOW()),
    "deleted_at" timestamp,
    "event_id" uuid NOT NULL REFERENCES "events" ("id"),
    "firstname" text NOT NULL,
    "lastname" text NOT NULL,
    "email" text NOT NULL,
    "phone" int NOT NULL,
    "phone_prefix" text NOT NULL,
    "adults" int ,
    "arrival" timestamp,
    "departure" timestamp,
    "comment" text,
    "attending" attending_types NOT NULL
);

CREATE TABLE "answers"(
    "id" uuid primary key default (gen_random_uuid()),
    "created_at" timestamp NOT NULL DEFAULT (NOW()),
    "updated_at" timestamp NOT NULL DEFAULT (NOW()),
    "deleted_at" timestamp,
    "question_id" uuid NOT NULL REFERENCES "questions" ("id"),
    "attendee_id" uuid NOT NULL REFERENCES "attendees" ("id"),
    "response" jsonb,
    "comment" text

);