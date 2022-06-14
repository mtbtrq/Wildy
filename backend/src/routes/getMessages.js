const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(`${config["databaseName"]}.db`);

const messagesTableName = config["msgTableName"];
const accountsTableName = config["accountsTableName"];

app.post("/get", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const channelName = req.body.channelName;

    if (!password || !username) { 
        return res.send({ success: false, cause: "No password or username provided!" });
    };

    const usernameData = db.prepare(`SELECT * FROM ${accountsTableName} WHERE username = ?`).get(username);
    const dbPassword = usernameData["password"];

    if (!dbPassword) {
        return res.send({
            success: false,
            cause: "No account found with the provided username!"
        });
    };

    bcrypt.compare(password, dbPassword, (err, result) => {
        if (result) {
            if (channelName && channelName.length > 1 && channelName.length < 20) {
                const tables = db.prepare(`SELECT name FROM sqlite_schema WHERE type='table'`).all();
                for (let table of tables) {
                    if ( table.name.toLowerCase() ==  channelName ) {
                        return res.send({ success: true, data: db.prepare(`SELECT * FROM ${table.name}`).all() });
                    };
                };
                return res.send({ success: false, cause: "No channel found with the specified name." });
            };

            const getMessagesStatement = db.prepare(`SELECT * FROM ${messagesTableName}`);
            const messages = getMessagesStatement.all();
    
            return res.send({
                success: true,
                data: messages
            });
        } else {
            return res.send({
                success: false,
                causeCode: "incorrect-pw",
                cause: "Incorrect password entered!",
            });
        };
    });
});

module.exports = app;