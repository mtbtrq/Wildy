import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

const Signup = () => {
    const handleClick = async () => {
        const usernameEl = document.getElementById("username");
        const passwordEl = document.getElementById("password");
        const statusEl = document.getElementById("statusEl");

        const baseURL = require("../config.json").apiURL;

        const password = passwordEl.value;
        const username = usernameEl.value;

        const data = {
            "password": password,
            "username": username
        };

        const url = `${baseURL}/createaccount`;
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
                if (jsonResponse.success === !0) {
                    statusEl.textContent = "Account Created!"
                    localStorage.setItem("username", username);
                    localStorage.setItem("password", password);
                    passwordEl.value = "";
                    usernameEl.value = "";
                    window.document.location = "/messaging";
                } else {
                    statusEl.textContent = jsonResponse.cause;
                };
            });
        } catch (err) {
            statusEl.textContent = "Something went wrong! Contact Mutayyab on discord: Mutyyab.#4275";
            console.log(err);
        };
    };

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
                            window.document.location = "/messaging";
                        } else {
                            localStorage.removeItem("password");
                            localStorage.removeItem("username");
                        };
                    });
                } catch (err) {
                    statusEl.textContent = "Something went wrong! Contact Mutayyab on discord: Mutyyab.#4275";
                    console.log(err);
                };
            } else if (username || password) {
                localStorage.clear();
            };
        })();
    }, []);

    return (
        <>
            <h1>Sign Up</h1>
            
            <input maxLength="20" className="inputBox" autoComplete="off" type="text" id="username" name="username" placeholder="Username" />
            
            <br />
            <br />

            <input maxLength="20" className="inputBox" autoComplete="off" type="password" id="password" name="password" placeholder="Password" />
            
            <p id="statusEl"></p>
            
            <button onClick={handleClick} id="submitButton">Sign Up</button>
            
            <p className="footer">Alternatively, if you have an account, you can <Link to="/signin">sign in.</Link></p>
        </>
    );
};

export default Signup;