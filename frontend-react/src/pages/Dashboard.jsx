
import { useEffect, useState } from "react";

function Dashboard() {

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    const fetchCategories = async () => {
      try {
// http://127.0.0.1:8000/categories/user_id?user_id=1
        const response = await fetch(
          `http://127.0.0.1:8000/categories/user_id?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch categories");
        }

        const data = await response.json();

        setCategories(data);

      } catch (error) {
        setError(error.message);
      }
    };

    if (token && userId) {
      fetchCategories();
    } else {
      setError("Please login first");
    }

  }, []);

  return (
    <div>
      <h2>My Dashboard</h2>

      <h3>My Categories</h3>

      {error && <p>{error}</p>}

      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id}>
            <button>
              {category.name}
            </button>
          </div>
        ))
      ) : (
        !error && <p>Loading categories...</p>
      )}

    </div>
  );
}

export default Dashboard;
