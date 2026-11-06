
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Tests() {

  const { categoryId } = useParams();

  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    const fetchTests = async () => {
      try {

        const response = await fetch(
          `http://127.0.0.1:8000/tests/category/?category_id=${categoryId}`,
          {
            method: "GET",
            headers: {
              "accept": "*/*",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch tests");
        }

        const data = await response.json();

        setTests(data);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchTests();

  }, [categoryId]);

  return (
    <div>
      <h2>Available Tests</h2>

      <p>Category ID: {categoryId}</p>

      {error && <p>{error}</p>}

      {tests.length > 0 ? (
        tests.map((test) => (
          <div key={test.id}>
            <h3>{test.name || test.title || `Test ${test.id}`}</h3>
          </div>
        ))
      ) : (
        !error && <p>Loading tests...</p>
      )}

    </div>
  );
}

export default Tests;
