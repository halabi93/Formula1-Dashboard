
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
ORDER BY (pit_stops.race_id);

-- Can be used with the above table
CREATE TABLE pit_stop_avg_per_driver AS
SELECT p.race_id, p.driver_id, AVG(p.duration_milli) AS avg_pit_time
FROM pit_stops AS p
GROUP BY (p.race_id, p.driver_id)
ORDER BY (avg_pit_time) DESC;

--Can be used to plot lap time average for each race throughout a season and compared with that of the individual driver throughout that season
CREATE TABLE lap_time_avg AS
SELECT l.race_id, AVG(l.time_milli) AS avg_lap_time
FROM lap_times AS l 
GROUP BY (l.race_id)
ORDER BY (avg_lap_time) DESC;

-- Can be used with the above table
CREATE TABLE lap_time_avg_per_driver AS
SELECT l.race_id, l.driver_id, AVG(l.time_milli) AS avg_lap_time
FROM lap_times AS l 
GROUP BY (l.race_id, l.driver_id)
ORDER BY (avg_lap_time) DESC;

--Can be used to plot fastest lap average speed for each race throughout a season and compared with that of the individual driver throughout that season
CREATE TABLE lap_fastest_time_avg AS
SELECT r.race_id, AVG(r.fastest_lap_speed) AS avg_fastest_lap
FROM results AS r
GROUP BY (r.race_id)
ORDER BY (avg_fastest_lap);

-- Can be used with the above table
CREATE TABLE fastest_lap_speed_per_driver AS
SELECT r.race_id, r.driver_id, AVG(r.fastest_lap_speed) AS fastest_lap_time
FROM results AS r
GROUP BY (r.race_id, r.driver_id)
ORDER BY (fastest_lap_time) DESC;

-- Used to obtain constructors with most wins
CREATE TABLE constructor_standings (
	race_id int,
	constructor_id int,
	points float
);

-- Calaculated who had the most points per year
DROP TABLE IF EXISTS max_points_per_year CASCADE;
CREATE TABLE max_points_per_year AS
SELECT r.year, MAX(c.points)
FROM constructor_standings  AS c
JOIN races AS r ON r.race_id=c.race_id
GROUP BY year
ORDER BY year DESC;

-- Calculated which team had how many points in each round. This was used with the above table to create the below table
DROP TABLE IF EXISTS team_points_per_round CASCADE;
CREATE TABLE team_points_per_round AS
SELECT c.points, r.year, r.round, con.name FROM constructor_standings AS c
JOIN races AS r on r.race_id=c.race_id
JOIN constructors AS con on con.constructor_id=c.constructor_id;

-- The below table shows the names of the teams that won since 1958
DROP TABLE IF EXISTS year_champs CASCADE;
CREATE TABLE year_champs AS
SELECT t.name
FROM max_points_per_year AS m
JOIN team_points_per_round AS t
ON t.points=m.max AND t.year=m.year 
GROUP BY m.year, m.max, t.name
ORDER BY name;