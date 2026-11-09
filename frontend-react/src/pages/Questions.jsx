
import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

function Questions() {
  const { testId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  // Receive category ID from Tests.jsx
  const categoryId = location.state?.categoryId;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch all questions for selected test
  useEffect(() => {
    let cancelled = false;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        setQuestions([]);
        setAnswers({});
        setCurrentIndex(0);

        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `http://127.0.0.1:8000/questions/?test_id=${testId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch questions.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid questions response from server.");
        }

        if (!cancelled) {
          setQuestions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      cancelled = true;
    };
  }, [testId]);

  // 2. Get current question ID
  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion?.id;

  // 3. Fetch options when current question changes
  useEffect(() => {
    if (!currentQuestionId) return;

    let cancelled = false;

    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/options/?question_id=${currentQuestionId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch options.");
        }

        const data = await response.json();

        if (!cancelled) {
          setQuestions((previousQuestions) =>
            previousQuestions.map((question) =>
              question.id === currentQuestionId
                ? { ...question, options: data }
                : question
            )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    };

    fetchOptions();

    return () => {
      cancelled = true;
    };
  }, [currentQuestionId]);

  // 4. Store selected answer
  const handleAnswer = (questionId, optionId) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionId,
    }));
  };

  // 5. Go to next question
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  // 6. Go to previous question
  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  // 7. Submit test and redirect to Tests page
  const submitTest = async () => {
    // Prevent accidental double submission
    if (submitting) return;

    // Ask confirmation before submitting
    const confirmed = window.confirm(
      "Are you sure you want to submit the test?"
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        throw new Error("Please login again.");
      }

      if (!categoryId) {
        throw new Error(
          "Category ID is missing. Please return to the tests page and start the test again."
        );
      }

      const response = await fetch(
        "http://127.0.0.1:8000/scores/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            test_id: Number(testId),
            answers: Object.entries(answers).map(
              ([questionId, optionId]) => ({
                question_id: Number(questionId),
                option_id: Number(optionId),
              })
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to submit test."
        );
      }

      // Successful submission: redirect to same category
      navigate(`/tests/${categoryId}`, {
        replace: true,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 8. Loading state
  if (loading) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading questions...
      </h2>
    );
  }

  // 9. Error state
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <p style={{ color: "red" }}>{error}</p>

        <button onClick={() => navigate(`/tests/${categoryId}`)}>
          Back to Tests
        </button>
      </div>
    );
  }

  // 10. Empty questions state
  if (questions.length === 0) {
    return (
      <p style={{ textAlign: "center" }}>
        No questions available for this test.
      </p>
    );
  }

  if (!currentQuestion) {
    return (
      <p>
        Question not found. Please refresh the page.
      </p>
    );
  }

  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  // 11. Display question page
  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "30px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header with Submit button on top-right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Online Test</h2>

        <button
          onClick={submitTest}
          disabled={submitting}
          style={{
            padding: "10px 20px",
            backgroundColor: submitting ? "#999" : "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>
      </div>

      <p>
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "8px",
            backgroundColor: "#2563eb",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* Question */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "10px",
        }}
      >
        <h3>
          Q{currentIndex + 1}. {currentQuestion.question_text}
        </h3>

        <p>
          <strong>Marks:</strong> {currentQuestion.marks}
        </p>

        {/* Options */}
        <div style={{ marginTop: "20px" }}>
          {currentQuestion.options ? (
            currentQuestion.options.map((option) => (
              <label
                key={option.id}
                style={{
                  display: "block",
                  padding: "15px",
                  marginBottom: "12px",
                  border:
                    answers[currentQuestion.id] === option.id
                      ? "2px solid #2563eb"
                      : "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor:
                    answers[currentQuestion.id] === option.id
                      ? "#eff6ff"
                      : "white",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={
                    answers[currentQuestion.id] === option.id
                  }
                  onChange={() =>
                    handleAnswer(currentQuestion.id, option.id)
                  }
                />

                {" "}
                {option.option_text}
              </label>
            ))
          ) : (
            <p>Loading options...</p>
          )}
        </div>
      </div>

      {/* Previous / Next buttons only */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "25px",
          gap: "10px",
        }}
      >
        <button
          onClick={previousQuestion}
          disabled={currentIndex === 0 || submitting}
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 && (
          <button
            onClick={nextQuestion}
            disabled={submitting}
          >
            Next
          </button>
        )}
      </div>

      {/* Answer count */}
      <p>
        Answered: {Object.keys(answers).length} / {questions.length}
      </p>
    </div>
  );
}

export default Questions;
