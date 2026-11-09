
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyForm from "./components/MyForm";
import ProtectedRoute from "./components/ProtectedRoute";

import Users from "./pages/users";
import Tests from "./pages/Tests";
import Questions from "./pages/Questions";
import Review from "./pages/Review";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/" element={<MyForm />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<Users />} />
          <Route path="/tests/:categoryId" element={<Tests />} />
          <Route path="/questions/:testId" element={<Questions />} />
          <Route path="/review/:scoreId" element={<Review />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
