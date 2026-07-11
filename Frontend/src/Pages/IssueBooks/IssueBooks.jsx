import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import API from "../../Services/api";
import "./IssueBooks.css";

function IssueBooks() {
  const token = localStorage.getItem("token");

  const [issueBooks, setIssueBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    book_id: "",
    issue_date: "",
    due_date: "",
  });

  // ===============================
  // Handle Change
  // ===============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // Fetch Issue Books
  // ===============================
  const fetchIssueBooks = async () => {
    try {
      const res = await API.get("/issue-books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssueBooks(res.data.issueBooks || []);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ===============================
  // Fetch Students
  // ===============================
  const fetchStudents = async () => {
    try {
      const res = await API.get("/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.students || []);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ===============================
  // Fetch Books
  // ===============================
  const fetchBooks = async () => {
    try {
      const res = await API.get("/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.books || []);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ===============================
  // Load Data
  // ===============================
  useEffect(() => {
    fetchIssueBooks();
    fetchStudents();
    fetchBooks();
  }, []);

  // ===============================
  // Issue Book
  // ===============================
const handleSubmit = async () => {
  console.log("Sending:", formData);

  try {
    const res = await API.post("/issue-books", formData);

    console.log("Response:", res.data);

    alert("Book Issued Successfully");
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log(err);
  }
};
  // ===============================
  // Return Book
  // ===============================
  const handleReturn = async (id) => {
    try {
      await API.put(
        `/issue-books/return/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book Returned Successfully");

      fetchIssueBooks();
      fetchBooks();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ===============================
  // Delete Issue
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this issue record?")) return;

    try {
      await API.delete(`/issue-books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Issue Record Deleted");

      fetchIssueBooks();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ===============================
  // Search Filter
  // ===============================
  const filteredIssues = issueBooks.filter((item) => {
    return (
      item.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.book_title?.toLowerCase().includes(search.toLowerCase())
    );
  });

    return (
    <>
      <Sidebar />
      <Navbar />

      <div className="issue-page">

        <div className="issue-header">
          <h1>📖 Issue Books</h1>

          <button
            className="issue-btn"
            onClick={() => setShowModal(true)}
          >
            + Issue Book
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by Student or Book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Book</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Fine</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="9">No Issue Records Found</td>
              </tr>
            ) : (
              filteredIssues.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>{item.student_name}</td>

                  <td>{item.book_title}</td>

                  <td>{item.issue_date}</td>

                  <td>{item.due_date}</td>

                  <td>{item.return_date || "-"}</td>

                  <td>{item.status}</td>

                  <td>₹ {item.fine}</td>

                  <td>

                    {item.status === "Issued" && (
                      <button
                        className="return-btn"
                        onClick={() => handleReturn(item.id)}
                      >
                        Return
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>

        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <h2>Issue Book</h2>

              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
              >
                <option value="">Select Student</option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.name}
                  </option>
                ))}
              </select>

              <select
                name="book_id"
                value={formData.book_id}
                onChange={handleChange}
              >
                <option value="">Select Book</option>

                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.id}
                  >
                    {book.title}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
              />

              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />

              <button
                className="save-btn"
                onClick={handleSubmit}
              >
                Issue Book
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);

                  setFormData({
                    student_id: "",
                    book_id: "",
                    issue_date: "",
                    due_date: "",
                  });
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>

    </>
  );
}

export default IssueBooks;
