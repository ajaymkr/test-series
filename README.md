uvicorn app.main:app --reload
/opt/homebrew/bin/python3.14 -m venv venv
python -m pip install -r requirements.txt
python -m app.init_db

# Test Series Application

A web-based test-series application for students. The project uses
**FastAPI** for the backend, **PostgreSQL** for data storage, and
**React (Vite)** for the frontend.

Students can log in, view the test categories and available tests,
attempt multiple-choice questions, submit their answers, view their
scores, and review their latest attempt with correct and incorrect
answers highlighted.

## Features

-   User login and authenticated API requests.
-   Category-based test listing.
-   Multiple-choice tests with question-by-question navigation.
-   Previous and next question navigation.
-   Answer selection and answered-question count.
-   Test submission and score calculation.
-   Previous-attempt history for each test.
-   Review of the latest attempt:
    -   Correct answers are highlighted in green.
    -   Incorrect selected answers are highlighted in red.
    -   The correct option is shown during review.
    -   Unanswered questions can also be identified.
-   Interactive API documentation through Swagger UI.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                               Technology
  ----------------------------------- -----------------------------------
  Frontend                            React, Vite, JavaScript

  Routing                             React Router

  Backend                             Python, FastAPI

  Database                            PostgreSQL

  ORM                                 SQLAlchemy

  API authentication                  Bearer token / JWT (as configured
                                      in the backend)

  API documentation                   Swagger UI / OpenAPI
  -----------------------------------------------------------------------

## Project Structure

The exact folder names may differ in your local project. A typical
structure is:

``` text
test-series/
├── backend/
│   ├── database/
│   │   ├── connection.py
│   │   └── models.py
│   ├── routers/
│   │   ├── questions.py
│   │   ├── scores.py
│   │   └── ...
│   ├── schemas/
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Questions.jsx
    │   │   ├── Tests.jsx
    │   │   └── Review.jsx
    │   └── App.jsx
    ├── package.json
    └── ...
```

## Prerequisites

Install the following before running the project:

-   Python 3.10 or later (use the version supported by your installed
    dependencies).
-   Node.js and npm.
-   PostgreSQL, either installed locally or running through Docker.
-   Git (optional, for source control).

## Backend Setup

Open a terminal and move into the backend directory:

``` bash
cd backend
```

Create and activate a virtual environment.

**macOS / Linux:**

``` bash
python3 -m venv venv
source venv/bin/activate
```

Install the Python dependencies:

``` bash
pip install -r requirements.txt
```

### Database configuration

Create a PostgreSQL database named `test_series_db` if it does not
already exist.

Configure the database connection in your backend
environment/configuration so it matches your local PostgreSQL setup. Do
not commit real database passwords or secret keys to Git.

Example configuration values (replace them with your own local values):

``` env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/test_series_db
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
```

If your project uses Docker Compose for PostgreSQL, start the database
from the directory containing `docker-compose.yml`:

``` bash
docker compose up -d postgres
```

### Start the FastAPI server

Run the command that matches the Python module containing your FastAPI
`app` instance. For example, if the instance is `app` in `main.py`:

``` bash
uvicorn main:app --reload
```

If your entry point is in a package, use its module path instead (for
example, `uvicorn app.main:app --reload`).

The backend should then be available at:

-   API base URL: `http://127.0.0.1:8000`
-   Swagger UI: `http://127.0.0.1:8000/docs`
-   OpenAPI schema: `http://127.0.0.1:8000/openapi.json`

## Frontend Setup

Open a second terminal and move into the frontend directory:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Start the Vite development server:

``` bash
npm run dev
```

Open the local URL printed by Vite in your terminal (commonly
`http://localhost:5173`).

The frontend currently calls the backend at:

``` text
http://127.0.0.1:8000
```

If you deploy the application or change the backend host, update the
frontend API base URL (ideally through a Vite environment variable such
as `VITE_API_BASE_URL`).

## API Endpoints

The following endpoints are referenced by the current frontend
implementation. Check Swagger UI at `http://127.0.0.1:8000/docs` for the
complete and authoritative list of routes, request schemas, response
schemas, and authentication requirements.

  -----------------------------------------------------------------------------------------------
  Method                  Endpoint                                        Purpose
  ----------------------- ----------------------------------------------- -----------------------
  GET                     `/questions/?test_id={test_id}`                 Get questions for a
                                                                          test

  GET                     `/options/?question_id={question_id}`           Get options for a
                                                                          question

  GET                     `/tests/category/?category_id={category_id}`    Get tests in a category

  POST                    `/scores/`                                      Submit answers and save
                                                                          the score

  GET                     `/scores/user/{user_id}/latest`                 Get the user's latest
                                                                          scores

  GET                     `/scores/{score_id}/review?user_id={user_id}`   Get saved answers and
                                                                          correct answers for
                                                                          review
  -----------------------------------------------------------------------------------------------

Some endpoints require an access token. For protected endpoints, the
frontend sends:

``` http
Authorization: Bearer <access_token>
```

### Submit test request example

The frontend submits a payload in this format:

``` json
{
  "user_id": 1,
  "test_id": 10,
  "answers": [
    {
      "question_id": 101,
      "option_id": 1001
    },
    {
      "question_id": 102,
      "option_id": 1005
    }
  ]
}
```

Only answered questions are included in this request. The backend should
account for unanswered questions when saving the attempt and preparing
the review.

## Main Frontend Routes

  Route                  Page
  ---------------------- -------------------------------
  `/`                    Login page
  `/users`               User page
  `/tests/:categoryId`   Tests available in a category
  `/questions/:testId`   Attempt a test
  `/review/:scoreId`     Review a submitted attempt

The exact route configuration is defined in `src/App.jsx`.

## Typical Student Workflow

1.  The student logs in.
2.  The application displays the student's available categories.
3.  The student selects a category and opens a test.
4.  The student answers questions using the Previous and Next controls.
5.  The student submits the test and confirms the submission.
6.  The backend calculates and stores the score and submitted answers.
7.  The student returns to the category's test list.
8.  The student can see previous attempts and choose **Review Last
    Attempt**.
9.  The review page displays the selected answers and the correct
    answers.

## Database Entities

The current application data model includes entities such as:

-   `users` --- student and user accounts.
-   `categories` --- test categories.
-   `tests` --- tests belonging to categories.
-   `questions` --- questions belonging to tests.
-   `options` --- answer options belonging to questions.
-   `scores` --- submitted test results.
-   `score_answers` --- selected option for each question in a submitted
    score.
-   `attempts` and `answers` --- attempt-related records, if used by the
    current workflow.

The SQLAlchemy models are defined in the backend model files. The
database schema should be kept in sync with those models.

## Development Notes

-   Start PostgreSQL before starting the backend.
-   Start the FastAPI backend before using the frontend.
-   Use Swagger UI to inspect and test backend endpoints.
-   Confirm that the frontend's API base URL matches the backend
    address.
-   Do not commit `.env`, database credentials, access tokens, or
    production secrets.
-   Before public deployment, enforce authorization on the backend and
    derive the logged-in user identity from the validated access token
    rather than trusting a user ID supplied by the browser.
-   Configure CORS on the backend to allow the frontend development
    origin.

## Troubleshooting

### Frontend cannot connect to the backend

-   Confirm that FastAPI is running on port `8000`.
-   Open `http://127.0.0.1:8000/docs` in your browser.
-   Check the browser console and Network tab for failed requests.
-   Check the backend terminal for exceptions.

### Database connection error

-   Confirm PostgreSQL or the Docker database container is running.
-   Check the database name, username, password, host, and port.
-   Ensure the backend database URL matches the running database
    configuration.

### Review button is not visible

-   Confirm that the test submission completed successfully.
-   Check that `POST /scores/` returned a successful response.
-   Check that `GET /scores/user/{user_id}/latest` returns the saved
    score, including its `id`.
-   Confirm that the frontend uses the same logged-in user ID when
    requesting the latest scores.

------------------------------------------------------------------------

## API Documentation

When the backend is running locally, open:

**http://127.0.0.1:8000/docs**

This Swagger UI page is the source of truth for the backend's currently
registered API routes.
