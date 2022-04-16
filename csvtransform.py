import pandas as pd

# Import CSV with constructors data
csv_file = "Project3-Formula1/Resources/constructors.csv"
constructors_df = pd.read_csv(csv_file)
constructors_df.head()

constructors_df = constructors_df.rename(columns={"constructorID": "constructor_id", "constructorRef": "constructor_ref"})

# Import CSV with races data
csv_file = "Project3-Formula1/Resources/races.csv"
races_df = pd.read_csv(csv_file)
races_df.head()

races_df = races_df.rename(columns={"raceID": "race_id", "circuitId": "circuit_id"})

# Import CSV with circuits data
csv_file = "Resources/circuits.csv"
circuits_df = pd.read_csv(csv_file)
circuits_df.head()

# Import CSV with results data
csv_file = "Resources/results.csv"
results_df = pd.read_csv(csv_file)
results_df.head()

# Import CSV with qualifying data
csv_file = "Resources/qualifying.csv"
qualifying_df = pd.read_csv(csv_file)
qualifying_df.head()

# Import CSV with pit_stops data
csv_file = "Resources/pit_stops.csv"
pit_stops_df = pd.read_csv(csv_file)
pit_stops_df.head()

# Import CSV with lap_times data
csv_file = "Resources/lap_times.csv"
lap_times_df = pd.read_csv(csv_file)
lap_times_df.head()

# Import CSV with status data
csv_file = "Resources/status.csv"
status_df = pd.read_csv(csv_file)
status_df.head()

# Import CSV with drivers data
csv_file = "Resources/drivers.csv"
drivers_df = pd.read_csv(csv_file)
drivers_df.head()