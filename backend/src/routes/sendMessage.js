const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(config["databaseName"]);

const accountsTableName = config["tableName"];
const tableName = config["msgTableName"];

app.post("/send", (req, res) => {
    const username = req.body.username;
    const message = req.body.message;
    const password = req.body.password;

    if (!message) return res.send({ success: false, cause: "No message provided!" })
    if (message.length > 100) return res.send({ success: false, cause: "Messages longer than 100 characters are not allowed!" })

    const usernameSelectStatement = db.prepare(`SELECT * FROM ${accountsTableName} WHERE username = ?`);
    const usernameData = usernameSelectStatement.get(username);
    const dbPassword = usernameData["password"]

    bcrypt.compare(password, dbPassword, (err, result) => {
        if (result) {
            const insertStatement = db.prepare(`INSERT INTO ${tableName} (username, message) VALUES (?, ?)`);
            insertStatement.run(username, message);
    
            res.send({
                success: true
            })
        } else {
            res.send({
                success: false,
                cause: "Incorrect password entered!",
            });
        }
    });
});

module.exports = app;
