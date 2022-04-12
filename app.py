from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
import scrape_formula1

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
    # if request.method == 'POST':
        # do stuff when the form is submitted

        # redirect to end the POST handling
        # the redirect can be to the same route or somewhere else
        # return redirect(url_for('index'))

    # show the form, it wasn't submitted
    return render_template('circuit.html')

if __name__ == "__main__":
    app.run(debug=True)





#     # Use flask_pymongo to set up mongo connection
# app.config["MONGO_URI"] = "mongodb://localhost:27017/mars_app"
# mongo = PyMongo(app)

# # Route to render index.html template using data from Mongo
# @app.route("/")
# def index():

#     # Find one record of data from the mongo database
#     mars_data = mongo.db.mars.find_one()

#     # Return template and data
#     return render_template("index.html", mars=mars_data)

# # Route that will trigger the scrape function
# @app.route("/scrape")
# def scrape():
#     mars = mongo.db.mars

#     # Run the scrape function
#     formula1_data = scrape.scrape_info()

#     # Update the Mongo database using update and upsert=True
#     mars.update_one({}, {"$set": formula1_data}, upsert = True)
