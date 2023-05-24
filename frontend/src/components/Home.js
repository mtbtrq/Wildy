import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

function Home() {
    useEffect(() => {
        const baseURL = require("../config.json").apiURL;
        (async () => {
            const username = localStorage.getItem("username");
            const password = localStorage.getItem("password");
            
            if (username && password) {
                const data = {
                    "username": username,
                    "password": password
                };
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                };
                
                try {
                    await fetch(`${baseURL}/signin`, options).then(async response => {
                        const jsonResponse = await response.json();
                        if (jsonResponse.success) {
                            document.getElementById("alreadySignedInText").classList.remove("hidden");
                            document.getElementById("startMessagingbutton").classList.remove("hidden");
                        } else {
                            localStorage.removeItem("password");
                            localStorage.removeItem("username");
                        };
                    });
                } catch (err) {
                    console.log("Something went wrong! Contact Mutayyab on discord: Mutyyab.#4275")
                    console.log(err)
                };
            };
        })();

        (async () => {
            await fetch(`${baseURL}/stats`).then(async response => {
                response = await response.json();
                document.getElementById("statsEl").textContent = `${response.onlineUsers} online user(s) with ${response.messagesSent} messages sent.`
            });
        })();
    }, []);

    return (
        <div>
            <h1>Wildy - A Chat Application</h1>

            <p className="normalText" id="statsEl"></p>

            <p className="normalText">Report bugs and suggestions on discord Mutyyab.#4275.</p>

            <p className="normalText">To start messaging, perform any of the actions below.</p>

            <Link to="/signup"><button className="button">Sign Up</button></Link>
            <Link to="/signin"><button className="button">Sign In</button></Link>

            <p className="normalText hidden" id="alreadySignedInText">You are already signed in</p>
            <Link to="/messaging"><button id="startMessagingbutton" className="hidden button">Start Messaging</button></Link>

            <br />

            <Link to="/tutorial"><p>Tutorial</p></Link>
        </div>
    );
};

export default Home;