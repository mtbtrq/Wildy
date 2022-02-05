const emailEl = document.getElementById("email");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const button = document.getElementById("submitButton");
const statusEl = document.getElementById("statusEl");
button.addEventListener("click", sendRequest);

const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

const baseURL = "https://chatapplication124.up.railway.app";

if (username && password) {
    window.document.location = "../messaging/messaging.html";
}

async function sendRequest() {
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
            window.location.href = "../messaging/messaging.html";
        } else {
            statusEl.textContent = jsonResponse.cause
        }
    })
}