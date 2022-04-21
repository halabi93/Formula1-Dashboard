
-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/oFXIk0
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Select * FROM circuits
-- Select * FROM constructors
-- Select * FROM drivers
-- Select * FROM lap_times
-- Select * FROM pit_stops
-- Select * FROM qualifying
-- Select * FROM races
-- Select * FROM results
-- Select * FROM status

DROP TABLE IF EXISTS constructors CASCADE;
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
DROP TABLE IF EXISTS drivers CASCADE;
CREATE TABLE "drivers" (
    "driver_id" int   NOT NULL,
    "first_name" text   NOT NULL,
    "last_name" text   NOT NULL,
    "dob" date   NOT NULL,
    "nationality" text   NOT NULL,
    "url" text   NOT NULL,
    CONSTRAINT "pk_driver" PRIMARY KEY (
        "driver_id"
     )
);
DROP TABLE IF EXISTS circuits CASCADE;
CREATE TABLE circuits (
    "circuit_id" int   NOT NULL,
    "circuit_ref" text   NOT NULL,
    "circuit_name" text   NOT NULL,
    "location" text   NOT NULL,
	"country" text NOT NULL,
    "lat" dec NOT NULL,
    "lng" dec NOT NULL,
    "alt" dec,
    "url" text   NOT NULL,
    CONSTRAINT "pk_circuit" PRIMARY KEY (
        "circuit_id"
     )
);
DROP TABLE IF EXISTS status CASCADE;
CREATE TABLE status (
    "status_id" int   NOT NULL,
    "status" text   NOT NULL,
    CONSTRAINT "pk_status" PRIMARY KEY (
        "status_id"
     )
);
DROP TABLE IF EXISTS races CASCADE;
CREATE TABLE races (
    "race_id" int   NOT NULL,
    "year" int   NOT NULL,
    "round" int   NOT NULL,
    "circuit_id" int   NOT NULL,
    "name" text   NOT NULL,
    "date" date,
    "time" time,
    "url" text   NOT NULL,
    CONSTRAINT "pk_race" PRIMARY KEY (
        "race_id"
     )
);
DROP TABLE IF EXISTS qualifying CASCADE;
CREATE TABLE qualifying (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "constructor_id" int   NOT NULL,
    "position" int   NOT NULL,
    "q1" time,
    "q2" time,
    "q3" time
);
DROP TABLE IF EXISTS lap_times CASCADE;
CREATE TABLE lap_times (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "lap" int   NOT NULL,
    "position" int   NOT NULL,
    "time_milli" int   NOT NULL
);
DROP TABLE IF EXISTS pit_stops CASCADE;
CREATE TABLE pit_stops (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "stop_number" int   NOT NULL,
    "lap" int   NOT NULL,
    "time" time   NOT NULL,
    "duration_milli" int   NOT NULL
);
DROP TABLE IF EXISTS results CASCADE;
CREATE TABLE results (
    "race_id" int   NOT NULL,
    "driver_id" int   NOT NULL,
    "constructor_id" int   NOT NULL,
    "grid" int   NOT NULL,
    "position" int   NOT NULL,
    "points" float   NOT NULL,
    "laps" int   NOT NULL,
    "time_milli" int,
    "fastest_lap" int,
    "fastest_lap_rank" int,
    "fastest_lap_time" time,
    "fastest_lap_speed" float,
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
------------------------------------------------------

--Can be used to plot pit stop duration for each race throughout a season and compared with that of the individual driver throughout that season
CREATE TABLE pit_stop_duration AS
SELECT pit_stops.race_id, AVG(pit_stops.duration_milli) AS avg_pit_duration
FROM pit_stops 
JOIN races 
ON pit_stops.race_id=races.race_id 
GROUP BY (pit_stops.race_id)
ORDER BY (pit_stops.race_id)

-- Can be used with the above table
CREATE TABLE pit_stop_avg_per_driver AS
SELECT p.race_id, p.driver_id, AVG(p.duration_milli) AS avg_pit_time
FROM pit_stops AS p
GROUP BY (p.race_id, p.driver_id)
ORDER BY (avg_pit_time) DESC

--Can be used to plot lap time average for each race throughout a season and compared with that of the individual driver throughout that season
CREATE TABLE lap_time_avg AS
SELECT l.race_id, AVG(l.time_milli) AS avg_lap_time
FROM lap_times AS l 
GROUP BY (l.race_id)
ORDER BY (avg_lap_time) DESC

-- Can be used with the above table
CREATE TABLE lap_time_avg_per_driver AS
SELECT l.race_id, l.driver_id, AVG(l.time_milli) AS avg_lap_time
FROM lap_times AS l 
GROUP BY (l.race_id, l.driver_id)
ORDER BY (avg_lap_time) DESC

--Can be used to plot fastest lap average speed for each race throughout a season and compared with that of the individual driver throughout that season
CREATE TABLE lap_fastest_time_avg AS
SELECT r.race_id, AVG(r.fastest_lap_speed) AS avg_fastest_lap
FROM results AS r
GROUP BY (r.race_id)
ORDER BY (avg_fastest_lap)

-- Can be used with the above table
CREATE TABLE fastest_lap_speed_per_driver AS
SELECT r.race_id, r.driver_id, AVG(r.fastest_lap_speed) AS fastest_lap_time
FROM results AS r
GROUP BY (r.race_id, r.driver_id)
ORDER BY (fastest_lap_time) DESC

CREATE TABLE all_races (
"Circuit" TEXT,
	"1" TEXT
)
--------------------------------------
SELECT * FROM all_races

SELECT "1", COUNT ("1") AS "Total_Wins" FROM "all_races" 
GROUP BY "1"
ORDER BY "Total_Wins" DESC

SELECT * FROM pit_stops

SELECT * FROM drivers WHERE driver_id=830

SELECT * FROM races WHERE race_id=847

--------------------------------------

SELECT l.race_id, l.avg_fastest_lap, r.year, r.round, r.name
FROM lap_fastest_time_avg AS l
JOIN races AS r ON r.race_id=l.race_id
ORDER BY (r.year,r.round)

-------------------------------------



SELECT * FROM lap_time_avg_per_driver

SELECT p.avg_pit_duration, r.race_id, r.year, r.round
FROM pit_stop_duration AS p
JOIN races AS r ON r.race_id=p.race_id
ORDER BY p.avg_pit_duration


SELECT * FROM pit_stops
WHERE race_id=967

SELECT circuits.circuit_name, COUNT(races.circuit_id) FROM races
INNER JOIN circuits ON races.circuit_id=circuits.circuit_id
GROUP BY races.circuit_id, circuits.circuit_name
ORDER BY COUNT(races.circuit_id) DESC



select races.circuit_id, count(races.circuit_id) as circuit_count
from races
group by races.circuit_id
 JOIN circuits ON races.circuit_id=circuits.circuit_id
order by count(circuit_id) DESC

select * FROM races

select COUNT(*) from pit_stops

SELECT * FROM races where race_id=841
SELECT * FROM pit_stops where race_id=841

SELECT pit_stops.race_id, pit_stops.driver_id, pit_stops.duration_milli, races.year, races.round, races.circuit_id
FROM pit_stops 
JOIN races 
ON pit_stops.race_id=races.race_id 
WHERE pit_stops.race_id=841



SELECT races.race_id, races.year, races.round, races.circuit_id
FROM races 






SELECT pit_stops.race_id, AVG(pit_stops.duration_milli) AS avg_pit_duration
FROM pit_stops 
JOIN races 
ON pit_stops.race_id=races.race_id 
GROUP BY (pit_stops.race_id)
JOIN pit_stops
on pit_stops.race_id=races.race_id
ORDER BY (pit_stops.race_id)



SELECT * FROM races WHERE race_id=1

SELECT * FROM results

SELECT * FROM lap_time_avg WHERE race_id=1

SELECT l.race_id, r.year, r.round, AVG(l.time_milli) AS avg_lap_time
FROM lap_times AS l 
JOIN races AS r 
ON r.race_id=l.race_id
WHERE r.year=2009
GROUP BY (l.race_id, r.year, r.round)
ORDER BY (l.race_id)


