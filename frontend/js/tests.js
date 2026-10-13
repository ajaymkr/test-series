const API_URL = "http://127.0.0.1:8000/tests/";

const token = localStorage.getItem("access_token");

const testGrid = document.getElementById("testGrid");
const message = document.getElementById("message");
const categoryTitle = document.getElementById("categoryTitle");
const logoutBtn = document.getElementById("logoutBtn");
const backBtn = document.getElementById("backBtn");


// --------------------------------------------------
// Check Login
// --------------------------------------------------

if (!token) {
    window.location.replace("login.html");
}


// --------------------------------------------------
// Get Category From URL
// --------------------------------------------------

const params = new URLSearchParams(window.location.search);

const category = params.get("category");

console.log("Selected category:", category);


if (!category) {

    categoryTitle.textContent = "No Category Selected";

    message.textContent = "Please select a test category.";

} else {

    categoryTitle.textContent =
        `${category.toUpperCase()} Test Series`;

    loadTests(category);
}


// --------------------------------------------------
// Load Tests
// --------------------------------------------------

async function loadTests(category) {

    try {

        message.textContent = "Loading tests...";

        const response = await fetch(
            `${API_URL}?category=${encodeURIComponent(category)}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        // ------------------------------------------
        // Authentication Error
        // ------------------------------------------

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("access_token");

            window.location.replace("login.html");

            return;
        }


        // ------------------------------------------
        // Other API Error
        // ------------------------------------------

        if (!response.ok) {

            throw new Error(
                `Failed to load tests. Status: ${response.status}`
            );
        }


        // ------------------------------------------
        // Get JSON
        // ------------------------------------------

        const tests = await response.json();

        console.log("Tests received:", tests);


        testGrid.innerHTML = "";
        message.textContent = "";


        // ------------------------------------------
        // No Tests
        // ------------------------------------------

        if (tests.length === 0) {

            message.textContent =
                "No tests are currently available for this category.";

            return;
        }


        // ------------------------------------------
        // Create Test Cards
        // ------------------------------------------

        tests.forEach(function (test) {

            createTestCard(test);

        });


    } catch (error) {

        console.error("Error loading tests:", error);

        message.textContent =
            "Unable to load tests. Please try again.";

    }
}


// --------------------------------------------------
// Create Test Card
// --------------------------------------------------

function createTestCard(test) {

    const card = document.createElement("div");

    card.className = "test-card";


    // Title
    const title = document.createElement("h2");

    title.textContent = test.title;


    // Description
    const description = document.createElement("p");

    description.className = "description";

    description.textContent =
        test.description || "No description available.";


    // Duration
    const duration = document.createElement("p");

    duration.className = "test-info";

    duration.textContent =
        `Duration: ${test.duration_minutes} minutes`;


    // Category
    const categoryElement = document.createElement("p");

    categoryElement.className = "test-info";

    categoryElement.textContent =
        `Category: ${test.category}`;


    // Start button
    const startButton = document.createElement("button");

    startButton.className = "start-btn";

    startButton.textContent = "Start Test";


    startButton.addEventListener("click", function () {

        console.log("Starting test:", test.id);

        window.location.href =
            `questions.html?test_id=${test.id}`;

    });


    // Add elements to card
    card.appendChild(title);

    card.appendChild(description);

    card.appendChild(duration);

    card.appendChild(categoryElement);

    card.appendChild(startButton);


    // Add card to grid
    testGrid.appendChild(card);
}


// --------------------------------------------------
// Back To Dashboard
// --------------------------------------------------

backBtn.addEventListener("click", function () {

    window.location.href = "dashboard.html";

});


// --------------------------------------------------
// Logout
// --------------------------------------------------

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("access_token");

    window.location.href = "login.html";

});