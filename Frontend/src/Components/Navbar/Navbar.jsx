import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="navbar">

      <div>
        <h2>Dashboard</h2>
      </div>

      <div className="navbar-right">

        <FaBell className="icon" />

        <div className="profile">

          <FaUserCircle className="user-icon" />

          <div>

            <h4>{user?.name}</h4>

            <p>{user?.role}</p>

          </div>

        </div>

      </div>

    </div>
  );

}

export default Navbar;