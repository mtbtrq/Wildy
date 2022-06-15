import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function CreateChannel() {
	const config = require("../config.json");
	const baseURL = config.apiURL;
	const username = localStorage.getItem("username");
	const password = localStorage.getItem("password");

	const handleClick = async () => {
		const channelCode = document.getElementById("privateChannelCodeEl").value;
		document.getElementById("privateChannelCodeEl").value = "";
		const statusEl = document.getElementById("codeStatusEl");
        statusEl.textContent = "Creating...";
		
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: username, password: password, channelName: channelCode })
		};

		const response = await( await fetch(`${baseURL}/createchannel`, options) ).json();
        if (response.success) {
            statusEl.textContent = `Successfully created channel! Channel name: ${response.channelName}`;
        } else {
            statusEl.textContent = response.cause;
        };
	};

    document.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            handleClick();
        };
    });

	useEffect(() => {
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
	});

    return (
		<>
			<h1>Create a private channel</h1>
			<input className="inputBox" type="text" id="privateChannelCodeEl" maxLength="20" autoComplete="off" placeholder="Enter your code here"/>
			<button id="submitButton" onClick={handleClick}>Create</button>
			<p id="codeStatusEl"></p>
            <br />
            <Link to="/messaging">Start Messaging</Link>
		</>
	);
};

export default CreateChannel;