import React, { useEffect } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";

const config = require("../config.json");
const baseURL = config.apiURL;
const socket = io(baseURL);

let currentChannel = "global";

const Messaging = () => {
    useEffect(() => {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        const messagesEl = document.getElementById("messages");
        const button = document.getElementById("submitButton");
        const signedInAsEl = document.getElementById("signedInAsEl");
        const signOutEl = document.getElementById("signOut");
        signedInAsEl.textContent = `Signed in as ${username}`;
        
        document.getElementById("currentChannelEl").innerHTML = `You are currently talking in <b id="currentChannelName">${currentChannel}</b>`;

        document.getElementById("currentChannelName").addEventListener("click", () => {
            document.getElementById("channelCodeInputEl").classList.remove("hidden");
            document.getElementById("channelNameSubmitButton").classList.remove("hidden");
        });

        document.getElementById("channelNameSubmitButton").addEventListener("click", async () => {
            currentChannel = document.getElementById("channelCodeInputEl").value.toLowerCase();

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ channelName: currentChannel })
            };

            const response = await (await fetch(`${baseURL}/checkchannelcode`, options)).json();
            if (response.success) {
                document.getElementById("currentChannelEl").innerHTML = `You are currently talking in <b id="currentChannelName">${currentChannel}</b>`;
                messagesEl.innerHTML = "";

                getMessages(currentChannel);

                document.getElementById("channelCodeInputEl").classList.add("hidden");
                document.getElementById("channelNameSubmitButton").classList.add("hidden");

                socket.on(`${currentChannel.toLowerCase()}Message`, data => {
                    const newMessage = document.createElement("li");
        
                    if (data.author !== username) {
                        if (notificationSound) notificationSound.play();
                        newMessage.classList.add("notMyMessage");
                    };
        
                    const timeSent = new Date(data.time);
                    const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`;
        
                    newMessage.textContent = `${time} - ${data.author}: ${data.message}`;
                    messagesEl.appendChild(newMessage);
                });
            } else {
                currentChannel = "global";
                document.getElementById("currentChannelEl").textContent = `Invalid channel code!`;
            };
        });

        let notificationSound;
        try { notificationSound = new Audio(config.notificationSoundURL); }
        catch { notificationSound = null; };
    
        signOutEl.addEventListener("click", () => {
            localStorage.clear();
            window.document.location = "/";
        });
    
        button.addEventListener("click", sendMessage);
    
        // Sends a new message
        function sendMessage() {
            const inputEl = document.getElementById("inputEl");
            const message = inputEl.value;
            inputEl.value = "";
            
            if (message.length < 1) {
                return;
            };

            const timeSent = new Date();
            const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`;
    
            const newMessage = document.createElement("li");
            newMessage.classList.add("myMessage");
            newMessage.textContent = `${time} - Me: ${message}`;
            document.getElementById("messages").appendChild(newMessage);

            const data = {
                username: username,
                password: password,
                message: message,
                channelName: currentChannel
            };
    
            socket.emit("sendNewMessage", data);
        };
        
        // Listen to the enter key press
        window.addEventListener("keyup", event => {
            if (event.key === "Enter") {
                sendMessage();
            };
        });
        
        // Check if signed in with correct credentials
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
            };
        })();

        // Handle a new message being recieved
        socket.on(`newMessage`, data => {
            console.log(data);
            const newMessage = document.createElement("li");

            if (data.author !== username) {
                if (notificationSound) notificationSound.play();
                newMessage.classList.add("notMyMessage");
            } else {
                newMessage.classList.add("myMessage");
            };

            const timeSent = new Date(data.time);
            const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`;

            newMessage.textContent = `${time} - ${data.author}: ${data.message}`;
            messagesEl.appendChild(newMessage);
        });

        // Function to fetch and render all previously sent messages, executed once when application is mounted
        async function getMessages(channelName) {
            messagesEl.textContent = "Loading...";
            const data = channelName ? { username: username, password: password, channelName: channelName } : { username: username, password: password };
            const response = await fetch(`${baseURL}/msg/get`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            messagesEl.textContent = "";

            const jsonResponse = await response.json();
            
            const msgs = jsonResponse["data"];

            msgs.forEach((msg) => {
                const timeSent = new Date(parseInt(msg.time));
                const time = `${timeSent.getUTCHours()}:${timeSent.getUTCMinutes()}:${timeSent.getUTCSeconds()}`;
                setMessages(msg.message, msg.username, time);
            });
        };
        getMessages();

        // Function to set messages in the form of an HTML list item and assign the classes depending on the author of the message
        function setMessages(message, author, time) {
            const newMessage = document.createElement("p");
            if (author === username) {
                newMessage.classList.add("myMessage");
                newMessage.textContent = `${time} - Me: ${message}`;
            } else {
                newMessage.classList.add("notMyMessage");
                newMessage.textContent = `${time} - ${author}: ${message}`;
            };
            messagesEl.appendChild(newMessage);
        };
    }, []);

    return (
		<>
            <p id="signedInAsEl" className="text"></p>
            <p id="signOut" className="signout">(Sign Out)</p>
            <div className="parent">
                <p id="currentChannelEl" className="normalText"></p>
                <input className="inputBox hidden" id="channelCodeInputEl" maxLength="20" type="text" autoComplete="off" placeholder="Enter the channel's code here" />
                <button id="channelNameSubmitButton" className="button hidden">Submit</button>
                <br />
                <ul id="messages"></ul>
            </div>
            <input className="inputBox" id="inputEl" maxLength="150" type="text" autoComplete="off" placeholder="Enter your message here" />
            <button id="submitButton">Send</button>
            <br />
            <br />
            <Link to="/createchannel">Create a private channel</Link>
		</>
	);
};

export default Messaging;