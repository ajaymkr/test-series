import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyForm from "./components/MyForm";
import Users from "./pages/users";
import Tests from "./pages/Tests";
import Questions from "./pages/Questions";
import Review from "./pages/Review";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tests/:categoryId" element={<Tests />} />
        <Route path="/questions/:testId" element={<Questions />} />
        <Route path="/review/:scoreId" element={<Review />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;