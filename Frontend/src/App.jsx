import { Routes, Route } from "react-router-dom";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Books from "./Pages/Books/Books";
import Categories from "./Pages/Categories/Categories";
import Students from "./Pages/Students/Students";
import IssueBooks from "./Pages/IssueBooks/IssueBooks";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/books" element={<Books />} />

      <Route path="/categories" element={<Categories />} />

      <Route path="/students" element={<Students />} />

      <Route path="/issue-books" element={<IssueBooks />} />
    </Routes>
  );
}

export default App;
