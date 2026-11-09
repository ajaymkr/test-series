
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Review() {
  const { scoreId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          `http://127.0.0.1:8000/scores/${scoreId}/review?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to fetch review."
          );
        }

        setReview(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [scoreId]);

  if (loading) {
    return <h2>Loading review...</h2>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!review) return null;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h2>Test Answer Review</h2>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <h3>Test Result</h3>

        <p>
          Score: <strong>{review.score}</strong>
        </p>

        <p>
          Total Questions: {review.total_questions}
        </p>

        <p>
          Correct Answers: {review.correct_answers}
        </p>
      </div>

      {review.questions.map((question, index) => {
        const statusColor =
          question.status === "correct"
            ? "green"
            : question.status === "incorrect"
            ? "red"
            : "#777";

        return (
          <div
            key={question.question_id}
            style={{
              padding: "20px",
              marginBottom: "20px",
              border: `2px solid ${statusColor}`,
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <h3>
                Q{index + 1}. {question.question_text}
              </h3>

              <strong
                style={{
                  color: statusColor,
                  whiteSpace: "nowrap",
                }}
              >
                {question.status === "correct"
                  ? "Correct"
                  : question.status === "incorrect"
                  ? "Incorrect"
                  : "Unattempted"}
              </strong>
            </div>

            <p>Marks: {question.marks}</p>

            {question.options.map((option) => {
              const isSelected =
                option.id === question.selected_option_id;

              const isCorrect =
                option.id === question.correct_option_id;

              let background = "white";
              let color = "#333";
              let border = "1px solid #ddd";
              let label = "";

              if (isCorrect) {
                background = "#dcfce7";
                color = "#166534";
                border = "2px solid green";
                label = " ✓ Correct Answer";
              }

              if (isSelected && !isCorrect) {
                background = "#fee2e2";
                color = "#991b1b";
                border = "2px solid red";
                label = " ✗ Your Answer";
              }

              if (isSelected && isCorrect) {
                label = " ✓ Your Correct Answer";
              }

              return (
                <div
                  key={option.id}
                  style={{
                    padding: "12px",
                    marginBottom: "10px",
                    border,
                    borderRadius: "7px",
                    backgroundColor: background,
                    color,
                  }}
                >
                  {option.option_text}
                  <strong>{label}</strong>
                </div>
              );
            })}
          </div>
        );
      })}

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "12px 25px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Tests
      </button>
    </div>
  );
}

export default Review;
