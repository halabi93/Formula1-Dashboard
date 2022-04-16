-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oFXIk0
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "constructors" (
    "constructor_id" int   NOT NULL,
    "constructor_ref" text   NOT NULL,
    "name" text   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_constructors" PRIMARY KEY (
        "constructor_id"
     )
);

CREATE TABLE "drivers" (
    "driver_id" int   NOT NULL,
    "driver_ref" text NOT NULL,
    "number" int NOT NULL,
    "code" text NOT NULL
    "first_name" text   NOT NULL,
    "last_name" text   NOT NULL,
    "dob" date   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_driver" PRIMARY KEY (
        "driver_id"
     )
);

CREATE TABLE "circuits" (
    "circuit_id" int   NOT NULL,
    "circuit_ref" text   NOT NULL,
    "circuit_name" text   NOT NULL,
    "location" text   NOT NULL,
    "lat" dec   NOT NULL,
    "lng" dec   NOT NULL,
    "alt" dec   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_circuit" PRIMARY KEY (
        "circuit_id"
     )
);

CREATE TABLE "status" (
    "status_id" int   NOT NULL,
    "status" text   NOT NULL,
    CONSTRAINT "pk_status" PRIMARY KEY (
        "status_id"
     )
);

CREATE TABLE "races" (
    "race_id" int   NOT NULL,
    "year" int   NOT NULL,
    "round" int   NOT NULL,
    "circuit_id" int   NOT NULL,
    "name" text   NOT NULL,
    "date" date   NOT NULL,
    "time" time   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_race" PRIMARY KEY (
        "race_id"
     )
);

CREATE TABLE "qualifying" (
    "qualify_id" int NOT NULL,
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "constructor_id" int   NOT NULL,
    "number" int NOT NULL,
    "position" int   NOT NULL,
    "q1" time   NOT NULL,
    "q2" time   NOT NULL,
    "q3" time   NOT NULL
);

CREATE TABLE "lap_times" (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "lap" int   NOT NULL,
    "position" int   NOT NULL,
    "time_milli" int   NOT NULL
);

CREATE TABLE "pit_stops" (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "stop_number" int   NOT NULL,
    "lap" int   NOT NULL,
    "time" time   NOT NULL,
    "duration_milli" int   NOT NULL
);

CREATE TABLE "results" (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "constructor_id" int   NOT NULL,
    "grid" int   NOT NULL,
    "position" int   NOT NULL,
    "points" float   NOT NULL,
    "laps" int   NOT NULL,
    "time_milli" int   NOT NULL,
    "fastest_lap" int   NOT NULL,
    "fastest_lap_rank" int   NOT NULL,
    "fastest_lap_time" time   NOT NULL,
    "fastest_lap_speed" float   NOT NULL,
    "status_id" int   NOT NULL
);

ALTER TABLE "races" ADD CONSTRAINT "fk_race_circuit_id" FOREIGN KEY("circuit_id")
REFERENCES "circuits" ("circuit_id");

ALTER TABLE "qualifying" ADD CONSTRAINT "fk_qualifying_race_id" FOREIGN KEY("race_id")
REFERENCES "races" ("race_id");

ALTER TABLE "qualifying" ADD CONSTRAINT "fk_qualifying_driver_id" FOREIGN KEY("driver_id")
REFERENCES "drivers" ("driver_id");

ALTER TABLE "qualifying" ADD CONSTRAINT "fk_qualifying_constructor_id" FOREIGN KEY("constructor_id")
REFERENCES "constructors" ("constructor_id");

ALTER TABLE "lap_times" ADD CONSTRAINT "fk_lap_times_race_id" FOREIGN KEY("race_id")
REFERENCES "races" ("race_id");

ALTER TABLE "lap_times" ADD CONSTRAINT "fk_lap_times_driver_id" FOREIGN KEY("driver_id")
REFERENCES "drivers" ("driver_id");

ALTER TABLE "pit_stops" ADD CONSTRAINT "fk_pit_stops_race_id" FOREIGN KEY("race_id")
REFERENCES "races" ("race_id");

ALTER TABLE "pit_stops" ADD CONSTRAINT "fk_pit_stops_driver_id" FOREIGN KEY("driver_id")
REFERENCES "drivers" ("driver_id");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_raceid_" FOREIGN KEY("race_id")
REFERENCES "races" ("race_id");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_driver_id" FOREIGN KEY("driver_id")
REFERENCES "drivers" ("driver_id");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_constructor_id" FOREIGN KEY("constructor_id")
REFERENCES "constructors" ("constructor_id");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_status_id" FOREIGN KEY("status_id")
REFERENCES "status" ("status_id");

