const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(config["databaseName"]);

const tableName = config["tableName"];

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!password || !username) { return res.send({ success: false, cause: "No password or username provided!" }) }

    const usernameData = db.prepare(`SELECT * FROM ${tableName} WHERE username = ?`).get(username);
    const dbPassword = usernameData["password"]

    if (!dbPassword) {
        return res.send({
            success: false,
            cause: "No account found with the provided username!"
        });
    };

    bcrypt.compare(password, dbPassword, (err, result) => {
        if (result) {
            return res.send({
                success: true
            });
        } else {
            return res.send({
                success: false,
                cause: "Incorrect password entered!",
            });
        };
    });
});

module.exports = app;