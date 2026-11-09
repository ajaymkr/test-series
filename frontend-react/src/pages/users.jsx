
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./Users.css";

function Users() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/users/?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");

          navigate("/", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to fetch user details.");
        }

        const data = await response.json();
        setUser(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // const logout = () => {
  //   // Clear authentication data
  //   localStorage.removeItem("access_token");
  //   localStorage.removeItem("user_id");

  //   // Replace current history entry with login page
  //   window.location.replace("/");
  // };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");

    navigate("/", { replace: true });
  };


  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div>
          <h1>Test Series</h1>
          <p>Your learning journey starts here.</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="welcome-section">
        <div>
          <h2>
            Welcome, {user ? user.name : "Student"}!
          </h2>

          <p>
            Prepare, practice and track your test performance.
          </p>
        </div>

        <div className="welcome-icon">
          🎓
        </div>
      </section>

      <section className="profile-section">
        <h3>My Profile</h3>

        {loading && <p>Loading user details...</p>}

        {error && (
          <p className="error-message">{error}</p>
        )}

        {user && (
          <div className="profile-card">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>

              <div className="profile-meta">
                <span>User ID: {user.id}</span>

                <span className="role-badge">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="tests-section">
        <h2>My Learning Dashboard</h2>

        <p className="section-description">
          Select a category and start practising your tests.
        </p>

        <Dashboard />
      </section>

      <footer className="dashboard-footer">
        © 2026 Test Series. All rights reserved.
      </footer>

    </div>
  );
}

export default Users;
