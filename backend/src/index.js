const app = require("express")();
app.use(require("cors")());
const Database = require("better-sqlite3");
const config = require("./config.json");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");

const db = new Database(`${config["databaseName"]}.db`);

const port = process.env.PORT || config.port;

const createAccountRoute = require("./routes/createAccount");
app.use("/", createAccountRoute);

const signInRoute = require("./routes/signIn");
app.use("/", signInRoute);

const createChannel = require("./routes/createChannel");
app.use("/", createChannel);

const checkChannelCode = require("./routes/checkChannelCode");
app.use("/", checkChannelCode);

const getMessage = require("./routes/getMessages");
app.use("/msg", getMessage);

let onlineUsers = 0;
let messagesSent = 0;

app.get("/stats", (req, res) => {
    return res.send({
        onlineUsers: onlineUsers,
        messagesSent: messagesSent
    });
});

app.post("/truncate", (req, res) => {
    const password = process.env.password || config.adminPassword;
    const usersPassword = req.body.password;

    if (password === usersPassword) {
        clearMessages();
        return res.send({ success: true });
    } else {
        return res.send({ success: false, cause: "Incorrect password" });
    };
});

const server = require("http").createServer(app);
const io = new Server(server, { cors: { origin: "*" } })
io.on("connection", socket => {
    onlineUsers += 1;
    socket.on("sendNewMessage", data => {
        const username = data.username;
        const message = data.message;
        const password = data.password;
        const channelName = data.channelName;

        if (!password || !username) return;

        if (!message) {
            return;
        };

        if (message.length > 150) {
            return;
        };

        const dbPassword = db.prepare(`SELECT * FROM ${config["accountsTableName"]} WHERE username = ?`).get(username)["password"];

        const time = new Date().getTime();

        bcrypt.compare(password, dbPassword, (err, result) => {
            if (result) {
                if (channelName == "global") {
                    db.prepare(`INSERT INTO ${config["msgTableName"]} (username, message, time) VALUES (?, ?, ?)`).run(username, message, time);

                    const broadcastData = {
                        "message": data.message,
                        "author": data.username,
                        "time": time
                    };
                    socket.broadcast.emit("newMessage", broadcastData);
                    messagesSent += 1;
                } else {
                    const tables = db.prepare(`SELECT name FROM sqlite_schema WHERE type='table'`).all();
                    for (let table of tables) {
                        if (table.name.toLowerCase() ===  channelName) {
                            db.prepare(`INSERT INTO ${channelName.toLowerCase()} (username, message, time) VALUES (?, ?, ?)`).run(username, message, time);

                            const broadcastData = {
                                "message": data.message,
                                "author": data.username,
                                "time": time
                            };
                            socket.broadcast.emit(`${channelName.toLowerCase()}Message`, broadcastData);
                        };
                    };
                };
            } else return;
        });
    });
    socket.on("disconnect", () => onlineUsers -= 1)
});

// Create tables
db.prepare(`CREATE TABLE IF NOT EXISTS ${config["accountsTableName"]} (
    password text,
    username text
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS ${config["msgTableName"]} (
    username text,
    message text,
    time text
)`).run();

async function clearMessages() {
    db.prepare(`DELETE FROM ${config["msgTableName"]}`).run();
    messagesSent = 0;
    if (config.sendAlertsToAPI) {
        try {
            const fetch = require("node-fetch-commonjs");
            const options = {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: `**Chat Application**\nCleared All messages from global chat.`
                })
            };
            const apiURL = process.env.alertsAPI || config.alertsAPIURL;
            await fetch(apiURL, options);
            return;
        } catch (err) {
            console.log(err);
            return;
        };
    } else {
        console.log("Cleared all messages from global chat.");
        return;
    };
};

server.listen(port, () => {
    console.log(`I am listening to requests on port ${port}`);
});