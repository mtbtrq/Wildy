const username = localStorage.getItem("username");
const password = localStorage.getItem("password");

if (username && password) {
    window.document.location = "messaging/messaging.html";
}