import { useEffect, useState } from "react";

import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import API from "../../Services/api";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data.dashboard);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Sidebar />

      <Navbar />

      <div className="dashboard">
        <h1 className="dashboard-title">Welcome Back 👋</h1>

        <div className="cards">
          <div className="dashboard-card books">
            <h2>Total Books</h2>
            <h1>{data.totalBooks || 0}</h1>
          </div>

          <div className="dashboard-card students">
            <h2>Total Students</h2>
            <h1>{data.totalStudents || 0}</h1>
          </div>

          <div className="dashboard-card category">
            <h2>Total Categories</h2>
            <h1>{data.totalCategories || 0}</h1>
          </div>

          <div className="dashboard-card issue">
            <h2>Issued Books</h2>
            <h1>{data.issuedBooks || 0}</h1>
          </div>
        </div>

        <div className="dashboard-bottom">
          <div className="recent-books">
            <h2>📚 Recent Books</h2>

            <table>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Category</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>JavaScript</td>
                  <td>John Smith</td>
                  <td>Programming</td>
                </tr>

                <tr>
                  <td>React JS</td>
                  <td>Andrew</td>
                  <td>Web</td>
                </tr>

                <tr>
                  <td>Node JS</td>
                  <td>Max</td>
                  <td>Backend</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary">
            <h2>📊 Today's Summary</h2>

            <p>📚 Books Available : {data.totalBooks || 0}</p>

            <p>👨 Students : {data.totalStudents || 0}</p>

            <p>📖 Issued Books : {data.issuedBooks || 0}</p>

            <p>🏷 Categories : {data.totalCategories || 0}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;