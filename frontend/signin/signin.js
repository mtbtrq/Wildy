const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const submitButton = document.getElementById("submitButton");
const statusEl = document.getElementById("statusEl");
submitButton.addEventListener('click', sendRequest);

const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

const baseURL = "https://chatapplication124.up.railway.app";

if (username && password) {
    window.document.location = "../messaging/messaging.html";
}

async function sendRequest() {
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
            window.document.location = "../messaging/messaging.html";
        } else {
            statusEl.textContent = jsonResponse.cause
        }
    })
};