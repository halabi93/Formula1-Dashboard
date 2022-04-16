-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oFXIk0
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "constructors" (
<<<<<<< HEAD
    "constructor_id" int   NOT NULL,
    "constructor_ref" text   NOT NULL,
=======
    "constructorid" int   NOT NULL,
    "constructorref" text   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "name" text   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_constructors" PRIMARY KEY (
<<<<<<< HEAD
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
=======
        "constructorid"
     )
);

CREATE TABLE "driver" (
    "driverid" int   NOT NULL,
    "firstname" text   NOT NULL,
    "lastname" text   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "dob" date   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_driver" PRIMARY KEY (
<<<<<<< HEAD
        "driver_id"
     )
);

CREATE TABLE "circuits" (
    "circuit_id" int   NOT NULL,
    "circuit_ref" text   NOT NULL,
    "circuit_name" text   NOT NULL,
=======
        "driverid"
     )
);

CREATE TABLE "circuit" (
    "circuitid" int   NOT NULL,
    "circuitref" text   NOT NULL,
    "nameofcircuit" text   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "location" text   NOT NULL,
    "lat" dec   NOT NULL,
    "lng" dec   NOT NULL,
    "alt" dec   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_circuit" PRIMARY KEY (
<<<<<<< HEAD
        "circuit_id"
=======
        "circuitid"
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
     )
);

CREATE TABLE "status" (
<<<<<<< HEAD
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
=======
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
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "name" text   NOT NULL,
    "date" date   NOT NULL,
    "time" time   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_race" PRIMARY KEY (
<<<<<<< HEAD
        "race_id"
=======
        "raceid"
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
     )
);

CREATE TABLE "qualifying" (
<<<<<<< HEAD
    "qualify_id" int NOT NULL,
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "constructor_id" int   NOT NULL,
    "number" int NOT NULL,
=======
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "constructorid" int   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "position" int   NOT NULL,
    "q1" time   NOT NULL,
    "q2" time   NOT NULL,
    "q3" time   NOT NULL
);

<<<<<<< HEAD
CREATE TABLE "lap_times" (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
=======
CREATE TABLE "laptime" (
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "lap" int   NOT NULL,
    "position" int   NOT NULL,
    "time_milli" int   NOT NULL
);

<<<<<<< HEAD
CREATE TABLE "pit_stops" (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "stop_number" int   NOT NULL,
=======
CREATE TABLE "pitstop" (
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "stopNumber" int   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "lap" int   NOT NULL,
    "time" time   NOT NULL,
    "duration_milli" int   NOT NULL
);

CREATE TABLE "results" (
<<<<<<< HEAD
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "constructor_id" int   NOT NULL,
=======
    "raceid" int   NOT NULL,
    "driverid" int   NOT NULL,
    "constructorid" int   NOT NULL,
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746
    "grid" int   NOT NULL,
    "position" int   NOT NULL,
    "points" float   NOT NULL,
    "laps" int   NOT NULL,
<<<<<<< HEAD
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
=======
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
>>>>>>> 6c8d3da27eec95719d4493a16a37ee4b4fba9746

