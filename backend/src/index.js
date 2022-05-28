const express = require("express");
const Database = require("better-sqlite3");
const config = require("./config.json");
const cors = require("cors");

const app = express();
app.use(cors())
const db = new Database(config["databaseName"]);

const port = process.env.PORT || config.port;

const createAccountRoute = require("./routes/createAccount");
app.use("/", createAccountRoute);

const signInRoute = require("./routes/signIn");
app.use("/", signInRoute);

const sendMessage = require("./routes/sendMessage");
app.use("/msg", sendMessage);

const getMessage = require("./routes/getMessages");
app.use("/msg", getMessage);

db.prepare(`CREATE TABLE IF NOT EXISTS ${config["tableName"]} (
    password text,
    username text
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS ${config["msgTableName"]} (
    username text,
    message text,
    messageid integer primary key autoincrement
)`).run();

setInterval(() => {
    db.prepare(`DELETE FROM ${config["msgTableName"]}`).run()
    console.log("Cleared all messages!")
}, 86400000)

app.listen(port, () => {
    console.log(`I am listening to requests on port ${port}`);
});
