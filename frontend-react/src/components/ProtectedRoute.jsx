
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      !!localStorage.getItem("access_token") &&
      !!localStorage.getItem("user_id")
  );

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");

      setIsAuthenticated(!!token && !!userId);
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
