
const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    message.textContent = "Logging in...";
    

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Login failed");
        }

        // Save the token for this browser session.
        sessionStorage.setItem("access_token", data.access_token);

        message.textContent = "Login successful!";

        // Replace this with your actual dashboard page.
        window.location.href = "dashboard.html";

    } catch (error) {
        message.textContent = error.message;
    }
});
