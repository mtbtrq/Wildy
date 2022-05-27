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
    try {
        const username = req.body.username;
        const password = req.body.password;

        const usernameData = db.prepare(`SELECT * FROM ${tableName} WHERE username = ?`).get(username);
        const dbPassword = usernameData["password"]

        bcrypt.compare(password, dbPassword, (err, result) => {
            if (result) {
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
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            cause: "No account found with the provided username!"
        });
    }
});

module.exports = app;