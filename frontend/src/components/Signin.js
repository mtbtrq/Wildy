import React from 'react';

const Signin = () => {
    const handleClick = async () => {
        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");
        const statusEl = document.getElementById("statusEl");
        
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        
        const baseURL = "https://chatapplication124.up.railway.app";
        
        if (username && password) {
            window.document.location = "/messaging";
        }
        
        const data = {
            "email": emailEl.value,
            "password": passwordEl.value
        }
        
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
            if (jsonResponse.success === !0) {
                statusEl.textContent = `Successfully signed in as ${jsonResponse["username"]}`;
                localStorage.setItem("username", jsonResponse["username"]);
                localStorage.setItem("password", passwordEl.value);
                emailEl.value = "";
                passwordEl.value = "";
                window.document.location = "/messaging";
            } else {
                statusEl.textContent = jsonResponse.cause
            }
        })
    }

    return (
        <>
            <h1>Sign In</h1>
        
            <p className="label">Email</p>
            <input maxLength="50" className="inputBox" type="email" id="email" name="email" placeholder="Email" />

            <p className="label">Password</p>
            <input maxLength="20" className="inputBox" type="password" id="password" name="password" placeholder="Password" />

            <p id="statusEl"></p>

            <button onClick={handleClick} id="submitButton">Submit</button>

            <p className="footer">Alternatively, if you don't have an account, you can <a href="/signup">sign up.</a></p>
        </>
    );
};

export default Signin;