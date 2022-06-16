const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(`${config["databaseName"]}.db`);

const accountstableName = config["accountsTableName"];

app.post("/createchannel", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const channelName = req.body.channelName;

        if (!channelName) return res.send({ success: false, cause: "Please specify a channel name." });
        if (channelName.toLowerCase() === "global" || channelName.toLowerCase() === config["accountsTableName"] || channelName.toLowerCase() === config["msgTableName"]) return res.send({ success: false, cause: "You are not allowed to have that channel name!" });
        if (channelName.length <= 1) return res.send({ success: false, cause: "Please specify a channel name longer than one character." });
        if (channelName > 20) return res.send({ success: false, cause: "Please specify a channel name shorter than 20 characters." });
    
        if (!password || !username) { 
            return res.send({ success: false, cause: "No password or username provided!" })
        };
    
        const usernameData = db.prepare(`SELECT * FROM ${accountstableName} WHERE username = ?`).get(username);
        let dbPassword;
        if (usernameData) dbPassword = usernameData["password"];
    
        if (!dbPassword) {
            return res.send({
                success: false,
                cause: "No account found with the provided username!"
            });
        };
    
        bcrypt.compare(password, dbPassword, (err, result) => {
            if (result) {
                try {
                    const formattedChannelName = channelName.replace(/\s/g, "").toLowerCase();
                    db.prepare(`CREATE TABLE ${formattedChannelName} (username text, message text, time text)`).run();
                    setTimeout(() => { db.prepare(`DROP TABLE ${formattedChannelName}`).run()}, config.deleteChannelsAfter);
                    res.send({ success: true, channelName: formattedChannelName });
                } catch (err) { console.log(err); return res.send({ success: false, cause: "A channel with that name already exists!" }) };
            } else {
                return res.send({
                    success: false,
                    cause: "Incorrect password entered!",
                });
            };
        });
    } catch (err) {
        console.log(err);
        return res.send({
            success: false,
            cause: err.message
        });
    };
});

module.exports = app;