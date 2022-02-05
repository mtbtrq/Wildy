const username = localStorage.getItem("username");
const password = localStorage.getItem("password");
const inputEl = document.getElementById("inputEl");
const messagesEl = document.getElementById("messages");
const button = document.getElementById("submitButton");
const signedInAsEl = document.getElementById("signedInAsEl");
const signOutEl = document.getElementById("signOut");
signedInAsEl.innerHTML = `Signed in as ${username}`;

signOutEl.addEventListener("click", () => {
    localStorage.clear();
    window.document.location = "../index.html";
});

const baseURL = "https://chatapplication124.up.railway.app";

let previousMessages = [];

if (!username || !password) {
    window.document.location = "../index.html";
}

button.addEventListener("click", main);

async function main() {
    const message = inputEl.value;
    inputEl.value = "";
    
    if (message.length < 2) {
        return;
    }

    const data = {
        username: username,
        password: password,
        message: message,
    };

    const url = `${baseURL}/msg/send`;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    await fetch(url, options);
}

getMessages();
setInterval(getMessages, 1000);

async function getMessages() {
    const response = await fetch(`${baseURL}/msg/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    const jsonResponse = await response.json();
    const msgs = jsonResponse["data"];

    msgs.forEach((msg, index) => {
        setMessages(msg.message, index, msg.username);
    });
}

function setMessages(message, index, author) {
    if (previousMessages[index] != message) {
        const newMessage = document.createElement("li");
        if (author == username) {
            newMessage.classList.add("myMessage");
            newMessage.textContent = `Me: ${message}`;
        } else {
            newMessage.classList.add("notMyMessage");
            newMessage.textContent = `${author}: ${message}`;
        }
        messagesEl.appendChild(newMessage);
        previousMessages.push(message);
    }
}
