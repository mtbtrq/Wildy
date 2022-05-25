import React from "react";

const Messaging = () => {
    const baseURL = require("../config.json").apiURL;
    return (
		<>
            <p id="signedInAsEl" className="text"></p>
            <p id="signOut" className="signout">(Sign Out)</p>
            <div className="parent">
                <ul id="messages"></ul>
            </div>
            <input className="inputBox" id="inputEl" maxLength="50" type="text" autoComplete="off" placeholder="Enter your message here" />
            <button id="submitButton">Send</button>
            <script>{
                window.addEventListener("DOMContentLoaded", () => {
                    const username = localStorage.getItem("username");
                    const password = localStorage.getItem("password");
                    const inputEl = document.getElementById("inputEl");
                    const messagesEl = document.getElementById("messages");
                    const button = document.getElementById("submitButton");
                    const signedInAsEl = document.getElementById("signedInAsEl");
                    const signOutEl = document.getElementById("signOut");
                    signedInAsEl.innerHTML = `Signed in as ${username}`;

                    signOutEl.addEventListener("click", () => {
                        localStorage.clear();
                        window.document.location = "/";
                    });

                    let previousMessages = [];

                    if (!username || !password) {
                        window.document.location = "/";
                    }

                    button.addEventListener("click", main);

                    async function main() {
                        const message = inputEl.value;
                        inputEl.value = "";
                        
                        if (message.length < 1) {
                            return;
                        }

                        const data = {
                            username: username,
                            password: password,
                            message: message,
                        };

                        const url = `${baseURL}/msg/send`;

                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        };

                        await fetch(url, options);
                    }

                    getMessages();
                    setInterval(getMessages, 1000);

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
                    }

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
                })
            }</script>
		</>
	);
};

export default Messaging;
