const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(`${config["databaseName"]}.db`);

app.post("/checkchannelcode", async (req, res) => {
    try {
        const channelName = (req.body.channelName).replace(/\s/g, "").toLowerCase();

        if (!channelName) return res.send({ success: false, cause: "Please specify a channel name." });

        const tables = db.prepare(`SELECT name FROM sqlite_schema WHERE type='table'`).all();
        for (let table of tables) {
            if ( table.name.toLowerCase() === channelName ) {
                return res.send({ success: true, channelName: channelName });
            };
        };
        return res.send({ success: false, cause: "No channel found with the specified name." });
            
    } catch (err) {
        console.log(err);
        return res.send({
            success: false,
            cause: err.message,
        });
    };
});

module.exports = app;