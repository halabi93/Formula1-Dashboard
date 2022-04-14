-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oFXIk0
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "constructors" (
    "constructorid" int   NOT NULL,
    "constructorref" text   NOT NULL,
    "name" text   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_constructors" PRIMARY KEY (
        "constructorid"
     )
);

CREATE TABLE "driver" (
    "driverid" int   NOT NULL,
    "firstname" text   NOT NULL,
    "lastname" text   NOT NULL,
    "dob" date   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_driver" PRIMARY KEY (
        "driverid"
     )
);

CREATE TABLE "circuit" (
    "circuitid" int   NOT NULL,
    "circuitref" text   NOT NULL,
    "nameofcircuit" text   NOT NULL,
    "location" text   NOT NULL,
    "lat" dec   NOT NULL,
    "lng" dec   NOT NULL,
    "alt" dec   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_circuit" PRIMARY KEY (
        "circuitid"
     )
);

CREATE TABLE "status" (
    "statusid" int   NOT NULL,
    "status" text   NOT NULL,
    CONSTRAINT "pk_status" PRIMARY KEY (
        "statusid"
     )
);

CREATE TABLE "race" (
    "raceid" int   NOT NULL,
    "year" int   NOT NULL,
    "round" int   NOT NULL,
    "circuitid" int   NOT NULL,
    "name" text   NOT NULL,
    "date" date   NOT NULL,
    "time" time   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_race" PRIMARY KEY (
        "raceid"
     )
);

CREATE TABLE "qualifying" (
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "constructorid" int   NOT NULL,
    "position" int   NOT NULL,
    "q1" time   NOT NULL,
    "q2" time   NOT NULL,
    "q3" time   NOT NULL
);

CREATE TABLE "laptime" (
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "lap" int   NOT NULL,
    "position" int   NOT NULL,
    "time(milli)" int   NOT NULL
);

CREATE TABLE "pitstop" (
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "stopNumber" int   NOT NULL,
    "lap" int   NOT NULL,
    "time" time   NOT NULL,
    "duration(milli)" int   NOT NULL
);

CREATE TABLE "results" (
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "constructorid" int   NOT NULL,
    "grid" int   NOT NULL,
    "position" int   NOT NULL,
    "points" float   NOT NULL,
    "laps" int   NOT NULL,
    "time(milli)" int   NOT NULL,
    "fastestlap" int   NOT NULL,
    "fastestlaprank" int   NOT NULL,
    "fastestlaptime" time   NOT NULL,
    "fastestlapspeed" float   NOT NULL,
    "statusid" int   NOT NULL
);

ALTER TABLE "race" ADD CONSTRAINT "fk_race_circuitid" FOREIGN KEY("circuitid")
REFERENCES "circuit" ("circuitid");

ALTER TABLE "qualifying" ADD CONSTRAINT "fk_qualifying_raceid" FOREIGN KEY("raceid")
REFERENCES "race" ("raceid");

ALTER TABLE "qualifying" ADD CONSTRAINT "fk_qualifying_driverid" FOREIGN KEY("driverid")
REFERENCES "driver" ("driverid");

ALTER TABLE "qualifying" ADD CONSTRAINT "fk_qualifying_constructorid" FOREIGN KEY("constructorid")
REFERENCES "constructors" ("constructorid");

ALTER TABLE "laptime" ADD CONSTRAINT "fk_laptime_raceid" FOREIGN KEY("raceid")
REFERENCES "race" ("raceid");

ALTER TABLE "laptime" ADD CONSTRAINT "fk_laptime_driverid" FOREIGN KEY("driverid")
REFERENCES "driver" ("driverid");

ALTER TABLE "pitstop" ADD CONSTRAINT "fk_pitstop_raceid" FOREIGN KEY("raceid")
REFERENCES "race" ("raceid");

ALTER TABLE "pitstop" ADD CONSTRAINT "fk_pitstop_driverid" FOREIGN KEY("driverid")
REFERENCES "driver" ("driverid");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_raceid" FOREIGN KEY("raceid")
REFERENCES "race" ("raceid");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_driverid" FOREIGN KEY("driverid")
REFERENCES "driver" ("driverid");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_constructorid" FOREIGN KEY("constructorid")
REFERENCES "constructors" ("constructorid");

ALTER TABLE "results" ADD CONSTRAINT "fk_results_statusid" FOREIGN KEY("statusid")
REFERENCES "status" ("statusid");

