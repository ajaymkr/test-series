
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

function Users() {

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      setError("Please login first");
      return;
    }

    const fetchUser = async () => {
      try {

        const response = await fetch(
          `http://127.0.0.1:8000/users/?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "accept": "*/*",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch user details");
        }

        const data = await response.json();
        setUser(data);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();

  }, []);

  return (
    <div>
      <h2>Welcome to Dashboard!</h2>

      {error && <p>{error}</p>}

      {user && (
        <div>
          <h3>User Details</h3>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      <hr />

      <Dashboard />

    </div>
  );
}

export default Users;
