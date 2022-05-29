import React, { useEffect } from "react";
import io from "socket.io-client";

const baseURL = require("../config.json").apiURL;
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
            }
    
            const newMessage = document.createElement("li");
            newMessage.classList.add("myMessage");
            newMessage.textContent = `Me: ${message}`;
            messagesEl.appendChild(newMessage);

            const data = {
                username: username,
                password: password,
                message: message,
            };
    
            socket.emit("sendNewMessage", data)
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
            newMessage.classList.add("notMyMessage");
            newMessage.textContent = `${data.author}: ${data.message}`;
            messagesEl.appendChild(newMessage);
        });

        getMessages();

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
                setMessages(msg.message, index, msg.username);
            });
        };

        function setMessages(message, index, author) {
            if (previousMessages[index] !== message) {
                const newMessage = document.createElement("li");
                if (author === username) {
                    newMessage.classList.add("myMessage");
                    newMessage.textContent = `Me: ${message}`;
                } else {
                    newMessage.classList.add("notMyMessage");
                    newMessage.textContent = `${author}: ${message}`;
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