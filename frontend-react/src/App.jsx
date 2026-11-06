import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyForm from "./components/MyForm";
import Users from "./pages/users";
import Tests from "./pages/Tests";
import Questions from "./pages/Questions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tests/:categoryId" element={<Tests />} />
        <Route path="/questions/:testId" element={<Questions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;