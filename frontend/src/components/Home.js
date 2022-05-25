import React from 'react';
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Chat Application</h1>

            <p className="normalText">Not the perfect means of communication, but it works :)</p>

            <p className="normalText">Report bugs and suggestions on discord (I know, ironic) Mutyyab.#4275</p>

            <p className="normalText">To continue, perform any of the actions below.</p>

            <Link to="/signup"><button id="button">Sign Up</button></Link>
            <Link to="/signin"><button id="button">Sign In</button></Link>

            <script>
                {
                    window.addEventListener("DOMContentLoaded", async () => {
                        const email = localStorage.getItem("email");
                        const password = localStorage.getItem("password");
                        
                        if (email && password) {
                            console.log("yes")
                            const data = {
                                "email": email,
                                "password": password
                            }

                            const baseURL = require("../config.json").apiURL;
                            const url = `${baseURL}/signin`;
                            
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data)
                            }
                            
                            await fetch(url, options).then(async response => {
                                const jsonResponse = await response.json();
                                if (jsonResponse.success) {
                                    window.document.location = "/messaging";
                                } else {
                                    localStorage.removeItem("email");
                                    localStorage.removeItem("password");
                                    localStorage.removeItem("username");
                                }
                            })
                        }
                    })
                }
            </script>
        </div>
    );
};

export default Home;
