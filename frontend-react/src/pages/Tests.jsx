import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Tests() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch tests and previous scores
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
          throw new Error("Please login first.");
        }

        // Fetch tests for selected category
        const testsResponse = await fetch(
          `http://127.0.0.1:8000/tests/category/?category_id=${categoryId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!testsResponse.ok) {
          throw new Error("Unable to fetch tests.");
        }

        const testsData = await testsResponse.json();

        // Fetch latest scores for logged-in user
        const scoresResponse = await fetch(
          `http://127.0.0.1:8000/scores/user/${userId}/latest`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!scoresResponse.ok) {
          throw new Error("Unable to fetch previous scores.");
        }

        const scoresData = await scoresResponse.json();

        if (!cancelled) {
          setTests(testsData);
          setScores(scoresData);
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

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  // Group scores according to test ID
  const scoresByTest = scores.reduce((result, score) => {
    if (!result[score.test_id]) {
      result[score.test_id] = [];
    }

    result[score.test_id].push(score);

    return result;
  }, {});

  // Navigate to Questions page and pass category ID
  const startTest = (testId) => {
    navigate(`/questions/${testId}`, {
      state: {
        categoryId: categoryId,
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Tests</h2>

      <p>Category ID: {categoryId}</p>

      {loading && <p>Loading tests...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {!loading &&
          tests.map((test) => {
            // Get latest three scores for this test
            const testScores = (scoresByTest[test.id] || [])
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.submitted_at) -
                  new Date(a.submitted_at)
              )
              .slice(0, 3);

            return (
              <div
                key={test.id}
                style={{
                  width: "280px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                }}
              >
                <h3>{test.title}</h3>

                <p>{test.description}</p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {test.duration_minutes} minutes
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: test.is_active ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {test.is_active ? "Active" : "Inactive"}
                  </span>
                </p>

                <p>
                  <strong>Test ID:</strong> {test.id}
                </p>

                {/* Previous attempts */}
                <div
                  style={{
                    marginTop: "15px",
                    marginBottom: "15px",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ marginTop: "0" }}>
                    Previous Attempts
                  </h4>

                  {testScores.length > 0 ? (
                    testScores.map((attempt, index) => (
                      <div
                        key={attempt.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom:
                            index !== testScores.length - 1
                              ? "1px solid #ddd"
                              : "none",
                          fontSize: "13px",
                        }}
                      >
                        <span>Attempt {index + 1}</span>

                        <strong>
                          {attempt.score}/{attempt.total_questions}
                        </strong>

                        <span>
                          {attempt.correct_answers} correct
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "13px", color: "#777" }}>
                      No attempts yet.
                    </p>
                  )}
                </div>

                {/* Start test button */}
                <button
                  disabled={!test.is_active}
                  onClick={() => startTest(test.id)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: test.is_active
                      ? "#2563eb"
                      : "#999",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: test.is_active
                      ? "pointer"
                      : "not-allowed",
                  }}
                >
                  Start Test
                </button>
              </div>
            );
          })}
      </div>

      {!loading && tests.length === 0 && !error && (
        <p>No tests available in this category.</p>
      )}
    </div>
  );
}

export default Tests;