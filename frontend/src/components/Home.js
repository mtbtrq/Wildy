import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

function Home() {
    useEffect(() => {
        (async () => {
            const username = localStorage.getItem("username");
            const password = localStorage.getItem("password");
            
            if (username && password) {
                const data = {
                    "username": username,
                    "password": password
                };

                const url = `${require("../config.json").apiURL}/signin`;
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                };
                
                try {
                    await fetch(url, options).then(async response => {
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
    }, []);

    return (
        <div>
            <h1>Chat Application</h1>

            <p className="normalText">Not the perfect means of communication, but it works :)</p>

            <p className="normalText">Report bugs and suggestions on discord (I know, ironic) Mutyyab.#4275</p>

            <p className="normalText">To continue, perform any of the actions below.</p>

            <Link to="/signup"><button className="button">Sign Up</button></Link>
            <Link to="/signin"><button className="button">Sign In</button></Link>

            <p className="normalText hidden" id="alreadySignedInText">You are already signed in</p>
            <Link to="/messaging"><button id="startMessagingbutton" className="hidden button">Start Messaging</button></Link>
        </div>
    );
};

export default Home;