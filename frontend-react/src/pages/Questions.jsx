
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Questions() {
  const { testId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchQuestions = async () => {
      try {
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
          throw new Error("Unable to fetch questions");
        }

        const data = await response.json();

        setQuestions(data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  // Fetch options for the current question
  useEffect(() => {
    if (questions.length === 0) return;

    const questionId = questions[currentIndex].id;

    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/options/?question_id=${questionId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch options");
        }

        const data = await response.json();

        setQuestions((previousQuestions) =>
          previousQuestions.map((question) =>
            question.id === questionId
              ? { ...question, options: data }
              : question
          )
        );

      } catch (error) {
        setError(error.message);
      }
    };

    fetchOptions();
  }, [questions, currentIndex]);

  const handleAnswer = (questionId, optionId) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionId,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  const submitTest = () => {
    console.log("Selected Answers:", answers);
    alert("Test submitted successfully!");
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading questions...</h2>;
  }

  if (error) {
    return <p style={{ color: "red", padding: "20px" }}>{error}</p>;
  }

  if (questions.length === 0) {
    return <p>No questions available.</p>;
  }

  const currentQuestion = questions[currentIndex];

  const progress =
    ((currentIndex + 1) / questions.length) * 100;

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
      <h2>Online Test</h2>

      <p>
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Progress Bar */}
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

      {/* Individual Question */}
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

        {/* Options fetched from API */}
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

                {" "}{option.option_text}
              </label>
            ))
          ) : (
            <p>Loading options...</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
        }}
      >
        <button
          onClick={previousQuestion}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button onClick={nextQuestion}>
            Next
          </button>
        ) : (
          <button onClick={submitTest}>
            Submit Test
          </button>
        )}
      </div>

      <p>
        Answered: {Object.keys(answers).length} / {questions.length}
      </p>
    </div>
  );
}

export default Questions;
