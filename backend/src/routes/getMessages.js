const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(config["databaseName"]);

const tableName = config["msgTableName"];
const accountsTableName = config["tableName"];

app.post("/get", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const usernameData = db.prepare(`SELECT * FROM ${accountsTableName} WHERE username = ?`).get(username);
    const dbPassword = usernameData["password"];

    bcrypt.compare(password, dbPassword, (err, result) => {
        if (result) {
            const getMessagesStatement = db.prepare(`SELECT * FROM ${tableName}`);
            const messages = getMessagesStatement.all();
    
            res.send({
                success: true,
                data: messages
            });
        } else {
            res.send({
                success: false,
                causeCode: "incorrect-pw",
                cause: "Incorrect password entered!",
            });
        }
    });
});

module.exports = app;