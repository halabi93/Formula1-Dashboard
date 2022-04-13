-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oFXIk0
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Constructors" (
    "constructorID" int   NOT NULL,
    "constructorRef" text   NOT NULL,
    "name" text   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_Constructors" PRIMARY KEY (
        "constructorID"
     )
);

CREATE TABLE "Driver" (
    "driverID" int   NOT NULL,
    "forename" text   NOT NULL,
    "surname" text   NOT NULL,
    "dob" date   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_Driver" PRIMARY KEY (
        "driverID"
     )
);

CREATE TABLE "Circuit" (
    "circuitID" int   NOT NULL,
    "circuitRef" text   NOT NULL,
    "nameOfCircuit" text   NOT NULL,
    "location" text   NOT NULL,
    "lat" dec   NOT NULL,
    "lng" dec   NOT NULL,
    "alt" dec   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_Circuit" PRIMARY KEY (
        "circuitID"
     )
);

CREATE TABLE "Status" (
    "statusID" int   NOT NULL,
    "status" text   NOT NULL,
    CONSTRAINT "pk_Status" PRIMARY KEY (
        "statusID"
     )
);

CREATE TABLE "Race" (
    "raceID" int   NOT NULL,
    "year" int   NOT NULL,
    "round" int   NOT NULL,
    "circuitID" int   NOT NULL,
    "name" text   NOT NULL,
    "date" date   NOT NULL,
    "time" time   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_Race" PRIMARY KEY (
        "raceID"
     )
);

CREATE TABLE "Qualifying" (
    "raceID" int   NOT NULL,
    "driverID" int   NOT NULL,
    "constructorID" int   NOT NULL,
    "position" int   NOT NULL,
    "q1" time   NOT NULL,
    "q2" time   NOT NULL,
    "q3" time   NOT NULL
);

CREATE TABLE "LapTime" (
    "raceID" int   NOT NULL,
    "driverID" int   NOT NULL,
    "lap" int   NOT NULL,
    "position" int   NOT NULL,
    "time(milli)" int   NOT NULL
);

CREATE TABLE "PitStop" (
    "raceID" int   NOT NULL,
    "driverID" int   NOT NULL,
    "stopNumber" int   NOT NULL,
    "lap" int   NOT NULL,
    "time" time   NOT NULL,
    "duration(milli)" int   NOT NULL
);

CREATE TABLE "Results" (
    "raceID" int   NOT NULL,
    "driverID" int   NOT NULL,
    "constructorID" int   NOT NULL,
    "grid" int   NOT NULL,
    "position" int   NOT NULL,
    "points" float   NOT NULL,
    "laps" int   NOT NULL,
    "time(milli)" int   NOT NULL,
    "fastestLap" int   NOT NULL,
    "fastestLapRank" int   NOT NULL,
    "fastestLaptime" time   NOT NULL,
    "fastestLapSpeed" float   NOT NULL,
    "statusID" int   NOT NULL
);

ALTER TABLE "Race" ADD CONSTRAINT "fk_Race_circuitID" FOREIGN KEY("circuitID")
REFERENCES "Circuit" ("circuitID");

ALTER TABLE "Qualifying" ADD CONSTRAINT "fk_Qualifying_raceID" FOREIGN KEY("raceID")
REFERENCES "Race" ("raceID");

ALTER TABLE "Qualifying" ADD CONSTRAINT "fk_Qualifying_driverID" FOREIGN KEY("driverID")
REFERENCES "Driver" ("driverID");

ALTER TABLE "Qualifying" ADD CONSTRAINT "fk_Qualifying_constructorID" FOREIGN KEY("constructorID")
REFERENCES "Constructors" ("constructorID");

ALTER TABLE "LapTime" ADD CONSTRAINT "fk_LapTime_raceID" FOREIGN KEY("raceID")
REFERENCES "Race" ("raceID");

ALTER TABLE "LapTime" ADD CONSTRAINT "fk_LapTime_driverID" FOREIGN KEY("driverID")
REFERENCES "Driver" ("driverID");

ALTER TABLE "PitStop" ADD CONSTRAINT "fk_PitStop_raceID" FOREIGN KEY("raceID")
REFERENCES "Race" ("raceID");

ALTER TABLE "PitStop" ADD CONSTRAINT "fk_PitStop_driverID" FOREIGN KEY("driverID")
REFERENCES "Driver" ("driverID");

ALTER TABLE "Results" ADD CONSTRAINT "fk_Results_raceID" FOREIGN KEY("raceID")
REFERENCES "Race" ("raceID");

ALTER TABLE "Results" ADD CONSTRAINT "fk_Results_driverID" FOREIGN KEY("driverID")
REFERENCES "Driver" ("driverID");

ALTER TABLE "Results" ADD CONSTRAINT "fk_Results_constructorID" FOREIGN KEY("constructorID")
REFERENCES "Constructors" ("constructorID");

ALTER TABLE "Results" ADD CONSTRAINT "fk_Results_statusID" FOREIGN KEY("statusID")
REFERENCES "Status" ("statusID");

