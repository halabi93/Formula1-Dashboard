const Client = require('pg').Client
// or const {Client} = require('pg')

const client = new Client({
    user:"postgres",
    password:"Zhalabi#11",
    host:"ZouheirElHalabi.local",
    port: 5432,
    database:"Formula1"
})

client.connect()
.then(() => console.log("Connected"))
.then(() => client.query("SELECT * FROM races"))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end())

