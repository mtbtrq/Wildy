const app = require("express")().use(require("cors")());
const Database = require("better-sqlite3");
const config = require("./config.json");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");

const db = new Database(config["databaseName"]);

const port = process.env.PORT || config.port;

const createAccountRoute = require("./routes/createAccount");
app.use("/", createAccountRoute);

const signInRoute = require("./routes/signIn");
app.use("/", signInRoute);

const getMessage = require("./routes/getMessages");
app.use("/msg", getMessage);

const server = require("http").createServer(app);
const io = new Server(server, { cors: { origin: "*" } })
io.on("connection", socket => {
    socket.on("sendNewMessage", data => {
        const username = data.username;
        const message = data.message;
        const password = data.password;

        if (!password || !username) return;

        if (!message) return res.send({ success: false, cause: "No message provided!" });
        if (message.length > 150) return res.send({ success: false, cause: "Messages longer than 150 characters are not allowed!" });

        const dbPassword = db.prepare(`SELECT * FROM ${config["tableName"]} WHERE username = ?`).get(username)["password"];

        bcrypt.compare(password, dbPassword, (err, result) => {
            if (result) {
                const insertStatement = db.prepare(`INSERT INTO ${config["msgTableName"]} (username, message) VALUES (?, ?)`);
                insertStatement.run(username, message);
            };
        });

        const broadcastData = {
            "message": data.message,
            "author": data.username
        };
        socket.broadcast.emit("newMessage", broadcastData);
    });
});

// Create tables
db.prepare(`CREATE TABLE IF NOT EXISTS ${config["tableName"]} (
    password text,
    username text
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS ${config["msgTableName"]} (
    username text,
    message text,
    messageid integer primary key autoincrement
)`).run();

// Clear all messages every 24 hours
setInterval(() => {
    db.prepare(`DELETE FROM ${config["msgTableName"]}`).run()
    console.log("Cleared all messages!")
}, 86400000)

server.listen(port, () => {
    console.log(`I am listening to requests on port ${port}`);
});