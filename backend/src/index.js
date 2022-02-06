const express = require("express");
const Database = require("better-sqlite3");
const config = require("./config.json");
const cors = require("cors");

const app = express();
app.use(cors())
const db = new Database(config["databaseName"]);

const tableName = config["tableName"];
const port = process.env.PORT || config.port;

const createAccountRoute = require("./routes/createAccount");
app.use("/", createAccountRoute);

const signInRoute = require("./routes/signIn");
app.use("/", signInRoute);

const sendMessage = require("./routes/sendMessage");
app.use("/msg", sendMessage);

const getMessage = require("./routes/getMessages");
app.use("/msg", getMessage);

const createTableStatement =
    db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (
    email text,
    password text,
    username text
)`);
createTableStatement.run();

app.get("/get", (req, res) => {
    const selectStatement = db.prepare(`SELECT * FROM ${tableName}`);
    const data = selectStatement.all();

    res.send({
        success: true,
        data: data,
    });
});

app.listen(port, () => {
    console.log(`I am listening to requests on port ${port}`);
});
