import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyForm from "./components/MyForm";
import Users from "./pages/users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;