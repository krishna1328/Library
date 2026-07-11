import {
  FaBook,
  FaUserGraduate,
  FaLayerGroup,
  FaBookReader,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <div className="sidebar">

      <div className="sidebar-logo">

        <h2>📚 Library</h2>

      </div>

      <ul>

        <li>
          <Link to="/dashboard">
            <FaHome />
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/books">
            <FaBook />
            Books
          </Link>
        </li>

        <li>
          <Link to="/students">
            <FaUserGraduate />
            Students
          </Link>
        </li>

        <li>
          <Link to="/categories">
            <FaLayerGroup />
            Categories
          </Link>
        </li>

        <li>
          <Link to="/issue-books">
            <FaBookReader />
            Issue Books
          </Link>
        </li>

      </ul>

      <div className="logout" onClick={handleLogout}>

        <FaSignOutAlt />

        Logout

      </div>

    </div>

  );

}

export default Sidebar;