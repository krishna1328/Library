import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../Services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    try {
      const res = await API.post("/auth/login", formData);

      console.log(res.data);
      if (res.data.success) {
        console.log("Inside Success");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login Successful");

        if (res.data.success) {
          navigate("/dashboard");
        }
      } else {
        console.log("Success is false");
      }
    } catch (err) {
      console.log("Catch Block");
      console.log(err);
      console.log(err.response);

      setMessage(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaBookOpen className="logo-icon" />

          <h1>Library Management</h1>

          <p>Login to continue</p>
        </div>

        {message && <p className="error">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="register-link">
          Don't have an account?
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
