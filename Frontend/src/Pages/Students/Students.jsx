import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import API from "../../Services/api";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    semester: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Fetch Students
  // =========================
  const fetchStudents = async () => {
    try {
      const res = await API.get("/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.students || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);


  // =========================
  // Add / Update Student
  // =========================
  const handleSubmit = async () => {
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.course ||
        !formData.semester
      ) {
        alert("Please Fill All Required Fields");
        return;
      }

      if (editId) {
        await API.put(
          `/students/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Student Updated Successfully");
      } else {
        await API.post(
          "/students",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Student Added Successfully");
      }

      setShowModal(false);

      setEditId(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        semester: "",
        address: "",
      });

      fetchStudents();

    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // =========================
  // Edit Student
  // =========================
  const handleEdit = (student) => {

    setEditId(student.id);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      course: student.course || "",
      semester: student.semester || "",
      address: student.address || "",
    });

    setShowModal(true);

  };

  // =========================
  // Delete Student
  // =========================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this student?")) return;

    try {

      await API.delete(`/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Student Deleted Successfully");

      fetchStudents();

    } catch (err) {

      console.log(err.response?.data || err);

    }

  };
    return (
    <>
      <Sidebar />
      <Navbar />

      <div className="students-page">
        <div className="students-header">
          <h1>🎓 Students</h1>

          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setEditId(null);

              setFormData({
                name: "",
                email: "",
                phone: "",
                course: "",
                semester: "",
                address: "",
              });
            }}
          >
            <FaPlus /> Add Student
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td>{student.address}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(student)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(student.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Students Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">

              <h2>
                {editId ? "Update Student" : "Add Student"}
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
              />

              <input
                type="text"
                name="semester"
                placeholder="Semester"
                value={formData.semester}
                onChange={handleChange}
              />

              <textarea
                name="address"
                placeholder="Address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              ></textarea>

              <button
                className="save-btn"
                onClick={handleSubmit}
              >
                {editId ? "Update" : "Save"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);

                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    course: "",
                    semester: "",
                    address: "",
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

export default Students;