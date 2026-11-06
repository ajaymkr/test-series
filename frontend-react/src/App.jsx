
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyForm from "./components/MyForm";
import Users from "./pages/users";
import Tests from "./pages/Tests";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MyForm />} />

        <Route path="/users" element={<Users />} />

        <Route path="/tests/:categoryId" element={<Tests />} />
        {/* <Route path="/tests" element={<Tests />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
