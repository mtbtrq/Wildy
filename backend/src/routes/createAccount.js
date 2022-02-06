const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const bscrypt = require("bcryptjs");
const config = require("../config.json");

const app = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = new Database(config["databaseName"]);

const tableName = config["tableName"];

app.post("/createaccount", async (req, res) => {
    try {
        const data = req.body;

        const email = data.email;
        const password = data.password;
        const username = data.username;

        if (email) {
            if (email.length < 4) {
                res.send({
                    success: false,
                    cause: "Please enter valid email!"
                })
                return
            }
        }

        if (password) {
            if (password.length < 5) {
                res.send({
                    success: false,
                    cause: "Password should be more than 5 characters in length!"
                })
                return
            }
        }

        if (username) {
            if (username.length < 5) {
                res.send({
                    success: false,
                    cause: "Username should be more than 5 characters in length!"
                })
                return
            }
        }

        const emailSelectStatement = db.prepare(`SELECT * FROM ${tableName} WHERE email = ?`);
        const emailData = emailSelectStatement.get(email);

        if (emailData) {
            res.send({
                success: false,
                cause: "User with the same email already exists!",
            });
            return
        }

        const usernameSelectStatement = db.prepare(`SELECT * FROM ${tableName} WHERE username = ?`);
        const usernameData = usernameSelectStatement.get(username);

        if (usernameData) {
            res.send({
                success: false,
                cause: "User with the same username already exists!",
            });
            return
        }

        const encryptedPassword = await bscrypt.hash(password, 10)

        const insertStatement = db.prepare(`INSERT INTO ${tableName} VALUES (?, ?, ?)`);
        insertStatement.run(email, encryptedPassword, username);

        res.send({
            success: true,
            username: username,
            password: password
        });
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            cause: JSON.stringify(err),
        });
    }
});

module.exports = app;