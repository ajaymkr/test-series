
const logoutBtn = document.getElementById("logoutBtn");
const testGrid = document.getElementById("testGrid");
const message = document.getElementById("message");

const API_URL = "http://127.0.0.1:8000/users/";

// 1. Logout
logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
});

// 2. Check token
const token = localStorage.getItem("access_token");

if (!token) {
    window.location.replace("login.html");
} else {
    loadEligibleTests();
}

// 3. Fetch users and display eligible tests
async function loadEligibleTests() {
    try {
        message.textContent = "Loading your test series...";

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("access_token");
            window.location.replace("login.html");
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const users = await response.json();

        // Find the logged-in user.
        // This assumes the API returns a list of users and
        // the JWT contains the user's ID in its "sub" claim.
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        const userId = Number(payload.sub);

        const currentUser = users.find(
            user => user.id === userId
        );

        if (!currentUser) {
            message.textContent = "User not found.";
            return;
        }

        // eligible_tests may be returned as an array
        // or as a PostgreSQL array string.
        let eligibleTests = currentUser.eligible_tests || [];

        if (typeof eligibleTests === "string") {
            eligibleTests = eligibleTests
                .replace(/^\{|\}$/g, "")
                .split(",")
                .filter(Boolean);
        }

        testGrid.innerHTML = "";

        if (eligibleTests.length === 0) {
            message.textContent = "No test series assigned to you.";
            return;
        }

        message.textContent = "";

        eligibleTests.forEach(function (category) {
            const card = document.createElement("div");
            card.className = "test-card";

            const title = document.createElement("h3");
            title.textContent = category;

            const viewButton = document.createElement("button");
            viewButton.className = "view-btn";
            viewButton.textContent = "View Tests";

            viewButton.addEventListener("click", function () {
                window.location.href =
                    `tests.html?category=${encodeURIComponent(category)}`;
            });

            card.appendChild(title);
            card.appendChild(viewButton);
            testGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        message.textContent =
            "Unable to load test series. Please try again.";
    }
}
