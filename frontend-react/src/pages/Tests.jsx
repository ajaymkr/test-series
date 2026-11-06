import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Tests() {
  const { categoryId } = useParams();

  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchTests = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/tests/category/?category_id=${categoryId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch tests");
        }

        const data = await response.json();
        setTests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [categoryId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Tests</h2>
      <p>Category ID: {categoryId}</p>

      {loading && <p>Loading tests...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {tests.map((test) => (
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
              <strong>Duration:</strong> {test.duration_minutes} minutes
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

            <button
              disabled={!test.is_active}
              style={{
                padding: "10px 20px",
                backgroundColor: test.is_active ? "#2563eb" : "#999",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: test.is_active ? "pointer" : "not-allowed",
              }}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>

      {!loading && tests.length === 0 && !error && (
        <p>No tests available in this category.</p>
      )}
    </div>
  );
}

export default Tests;