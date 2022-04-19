from flask import Flask, jsonify , render_template, redirect, request, url_for
from flask_pymongo import PyMongo
import scrape_formula1
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config import user, password, db_name
from sqlalchemy.sql import text, select
import pandas as pd


# Database Setup
rds_connection_string = f"{user}:{password}@localhost:5432/{db_name}"
engine = create_engine(f"postgresql://{rds_connection_string}")

# Reflect an existing database and tables
base = automap_base()
base.prepare(engine, reflect = True)

# Save reference to the tables
session = Session(engine)
session.close()


# Create an instance of Flask
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/formula1_app"
mongo = PyMongo(app)

# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    # Find one record of data from the mongo database
    formula1_data = mongo.db.formula1.find_one()

    # Return template and data
    return render_template("index.html", formula1=formula1_data)

# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():
    formula1 = mongo.db.formula1

    # Run the scrape function
    formula1_data = scrape_formula1.scrape_info()

    # Update the Mongo database using update and upsert=True
    formula1.update_one({}, {"$set": formula1_data}, upsert = True)

    # Redirect back to home page
    return redirect("/", code=302)

@app.route('/circuit', methods=['GET', 'POST'])
def circuit_map():
    markers=[
            {
            'lat':0,
            'lon':0,
            'popup':'This is the middle of the map.'
            }
        ]
    # show the form, it wasn't submitted
    return render_template('circuit.html', markers = markers)


@app.route('/avg-lap-time/<year>')
def avg_lap_time(year):
    session = Session(engine)
    q = f"SELECT lap_times.race_id, races.year, races.round, AVG(lap_times.time_milli) AS avg_lap_time \
            FROM lap_times \
                JOIN races \
                    ON races.race_id=lap_times.race_id \
                        WHERE races.year={year} \
                            GROUP BY (lap_times.race_id, races.year, races.round) \
                                ORDER BY (races.round)"
    results = pd.read_sql(q,engine)
    results = results.drop(["race_id", "year", "round"], axis = 1)
    datadict = results.to_dict('records')
    session.close()
    return jsonify(datadict)


@app.route('/avg-lap-time-per-driver/<year>/<first_name>/<last_name>')
def avg_lap_time_per_driver(year, first_name, last_name):
    session = Session(engine)
    q = f"SELECT l.race_id, l.avg_lap_time, l.driver_id, d.first_name, d.last_name, r.year, r.round \
            FROM lap_time_avg_per_driver AS l \
                JOIN races AS r ON r.race_id=l.race_id  \
                    JOIN drivers AS d ON l.driver_id=d.driver_id  \
                        WHERE (year={year} AND last_name='{last_name}' AND first_name='{first_name}')\
                            ORDER BY (r.year,r.round)"
    results = pd.read_sql(q,engine)
    results = results.drop(["race_id", "driver_id", "year", "round", "first_name", "last_name"], axis = 1)
    datadict = results.to_dict('records')
    session.close()
    return jsonify(datadict)



@app.route('/avg-pit-time/<year>')
def avg_pit_time(year):
    session = Session(engine)
    q = f"SELECT p.race_id, p.avg_pit_duration, r.year, r.round \
            FROM pit_stop_duration AS p \
                JOIN races AS r ON r.race_id=p.race_id \
                    WHERE year={year}\
                        ORDER BY (r.year,r.round)"
    results = pd.read_sql(q,engine)
    results = results.drop(["race_id", "year", "round"], axis = 1)
    datadict = results.to_dict('records')
    session.close()
    return jsonify(datadict)


@app.route('/avg-pit-time-per-driver/<year>/<first_name>/<last_name>')
def avg_pit_time_per_driver(year, first_name, last_name):
    session = Session(engine)
    q = f"SELECT p.race_id, p.avg_pit_time, p.driver_id, d.first_name, d.last_name, r.year, r.round \
            FROM pit_stop_avg_per_driver AS p \
                JOIN races AS r ON r.race_id=p.race_id \
                    JOIN drivers AS d ON p.driver_id=d.driver_id \
                        WHERE (year={year} AND last_name='{last_name}' AND first_name='{first_name}')\
                            ORDER BY (r.year,r.round)"
    results = pd.read_sql(q,engine)
    results = results.drop(["race_id", "driver_id", "year", "round", "first_name", "last_name"], axis = 1)
    datadict = results.to_dict('records')
    session.close()
    return jsonify(datadict)


@app.route('/avg-fastest-lap-speed/<year>')
def avg_fastest_lap_speed(year):
    session = Session(engine)
    q = f"SELECT l.race_id, l.avg_fastest_lap, r.year, r.round, r.name \
            FROM lap_fastest_time_avg AS l \
                JOIN races AS r ON r.race_id=l.race_id  \
                    WHERE year={year}\
                        ORDER BY (r.year,r.round)"
    results = pd.read_sql(q,engine)
    results = results.drop(["race_id", "year", "round"], axis = 1)
    datadict = results.to_dict('records')
    session.close()
    return jsonify(datadict)


@app.route('/fastest-lap-avg-speed-per-driver/<year>/<first_name>/<last_name>')
def fastest_lap_avg_speed_per_driver(year, first_name, last_name):
    session = Session(engine)
    q = f"SELECT f.race_id, f.fastest_lap_time, f.driver_id, d.first_name, d.last_name, r.year, r.round \
            FROM fastest_lap_speed_per_driver AS f  \
                JOIN races AS r ON r.race_id=f.race_id \
                    JOIN drivers AS d ON f.driver_id=d.driver_id \
                        WHERE (year={year} AND last_name='{last_name}' AND first_name='{first_name}')\
                            ORDER BY (r.year,r.round)"
    results = pd.read_sql(q,engine)
    results = results.drop(["race_id", "driver_id", "year", "round", "first_name", "last_name"], axis = 1)
    datadict = results.to_dict('records')
    session.close()
    return jsonify(datadict)




if __name__ == "__main__":
    app.run(debug=True)

