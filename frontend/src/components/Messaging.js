import React, { useEffect } from "react";
import io from "socket.io-client";

const config = require("../config.json")
const baseURL = config.apiURL;
const socket = io(baseURL)

const Messaging = () => {
    useEffect(() => {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        const messagesEl = document.getElementById("messages");
        const button = document.getElementById("submitButton");
        const signedInAsEl = document.getElementById("signedInAsEl");
        const signOutEl = document.getElementById("signOut");
        signedInAsEl.textContent = `Signed in as ${username}`;

        let notificationSound;
        try { notificationSound = new Audio(config.notificationSoundURL); }
        catch { notificationSound = null; }
    
        signOutEl.addEventListener("click", () => {
            localStorage.clear();
            window.document.location = "/";
        });
    
        button.addEventListener("click", sendMessage);
    
        function sendMessage() {
            const inputEl = document.getElementById("inputEl");
            const message = inputEl.value;
            inputEl.value = "";
            document.getElementById("statusEl").textContent = "";
            
            if (message.length < 1) {
                return;
            };

            const timeSent = new Date();
            const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`
    
            const newMessage = document.createElement("li");
            newMessage.classList.add("sendingMessage");
            newMessage.textContent = `${time} - Me: ${message}`;
            messagesEl.appendChild(newMessage);

            const data = {
                username: username,
                password: password,
                message: message,
            };
    
            socket.emit("sendNewMessage", data)
            newMessage.classList.add("myMessage");
            newMessage.classList.remove("sendingMessage");
        };

        let previousMessages = [];
        
        (async () => {
            if (username && password) {
                const data = {
                    "username": username,
                    "password": password
                };
                
                const url = `${baseURL}/signin`;
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                };
                
                await fetch(url, options).then(async response => {
                    const jsonResponse = await response.json();
                    if (!jsonResponse.success) {
                        localStorage.removeItem("password");
                        localStorage.removeItem("username");
                        window.document.location = "/";
                    };
                });
            } else if (!username || !password) {
                localStorage.clear();
                window.document.location = "/";
            }
        })();

        socket.on("newMessage", data => {
            const newMessage = document.createElement("li");

            if (data.author !== username) {
                if (notificationSound) notificationSound.play()
                newMessage.classList.add("notMyMessage");
            } else { newMessage.classList.add("myMessage"); }

            const timeSent = new Date(data.time);
            const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`

            newMessage.textContent = `${time} - ${data.author}: ${data.message}`;
            messagesEl.appendChild(newMessage);
        });

        async function getMessages() {
            const response = await fetch(`${baseURL}/msg/get`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const jsonResponse = await response.json();
            if (!jsonResponse.success && jsonResponse.causeCode === "incorrect-pw") return window.document.location = "/";
            
            const msgs = jsonResponse["data"];

            msgs.forEach((msg, index) => {
                const timeSent = new Date(parseInt(msg.time));
                const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`
                setMessages(msg.message, index, msg.username, time);
            });
        };
        getMessages();

        function setMessages(message, index, author, time) {
            if (previousMessages[index] !== message) {
                const newMessage = document.createElement("li");
                if (author === username) {
                    newMessage.classList.add("myMessage");
                    newMessage.textContent = `${time} - Me: ${message}`;
                } else {
                    newMessage.classList.add("notMyMessage");
                    newMessage.textContent = `${time} - ${author}: ${message}`;
                };
                messagesEl.appendChild(newMessage);
                previousMessages.push(message);
            };
        };
    
    }, [])


    return (
		<>
            <p id="signedInAsEl" className="text"></p>
            <p id="signOut" className="signout">(Sign Out)</p>
            <div className="parent">
                <ul id="messages"></ul>
            </div>
            <input className="inputBox" id="inputEl" maxLength="150" type="text" autoComplete="off" placeholder="Enter your message here" />
            <button id="submitButton">Send</button>
            <br />
            <p id="statusEl"></p>
		</>
	);
};

export default Messaging;