import React from 'react';
import { Link } from "react-router-dom";

const Signup = () => {
    const handleClick = async () => {
        const emailEl = document.getElementById("email");
        const usernameEl = document.getElementById("username");
        const passwordEl = document.getElementById("password");
        const statusEl = document.getElementById("statusEl");

        const local_username = localStorage.getItem("username");
        const local_password = localStorage.getItem("password");

        const baseURL = "https://chatapplication124.up.railway.app";

        if (local_username && local_password) {
            window.document.location = "/messaging";
        }

        const data = {
            "email": emailEl.value,
            "password": passwordEl.value,
            "username": usernameEl.value
        };

        const password = passwordEl.value;
        const username = usernameEl.value;

        const url = `${baseURL}/createaccount`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
        await fetch(url, options).then(async response => {
            const jsonResponse = await response.json();
            if (jsonResponse.success === !0) {
                statusEl.textContent = "Account Created!"
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                emailEl.value = "";
                passwordEl.value = "";
                usernameEl.value = "";
                window.location.href = "/messaging";
            } else {
                statusEl.textContent = jsonResponse.cause
            }
        })
    }

    return (
        <>
            <h1>Sign Up</h1>
            
            <p className="label">Username</p>
            <input maxLength="20" className="inputBox" autoComplete="off" type="text" id="username" name="username" placeholder="Username" />
            
            <p className="label">Email</p>
            <input maxLength="50" className="inputBox" autoComplete="off" type="email" id="email" name="email" placeholder="Email" />
            
            <p className="label">Password</p>
            <input maxLength="20" className="inputBox" autoComplete="off" type="password" id="password" name="password" placeholder="Password" />
            
            <p id="statusEl"></p>
            
            <button onClick={handleClick} id="submitButton">Submit</button>
            
            <p className="footer">Alternatively, if you have an account, you can <Link to="/signin">sign in.</Link></p>
        </>
    );
};

export default Signup;