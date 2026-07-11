import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import API from "../../Services/api";
import "./Categories.css";

function Categories() {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    category_name: "",
  });

  // ==========================
  // Handle Change
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Fetch Categories
  // ==========================
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data.categories || []);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
    // ==========================
  // Search
  // ==========================
  const filteredCategories = categories.filter((category) =>
    category.category_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==========================
  // Save / Update Category
  // ==========================
  const handleSubmit = async () => {
    try {
      if (!formData.category_name.trim()) {
        alert("Please Enter Category Name");
        return;
      }

      if (editId) {
        await API.put(`/categories/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Category Updated Successfully");
      } else {
        await API.post("/categories", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Category Added Successfully");
      }

      setShowModal(false);
      setEditId(null);

      setFormData({
        category_name: "",
      });

      fetchCategories();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ==========================
  // Edit Category
  // ==========================
  const handleEdit = (category) => {
    setEditId(category.id);

    setFormData({
      category_name: category.category_name,
    });

    setShowModal(true);
  };

  // ==========================
  // Delete Category
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await API.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Category Deleted Successfully");

      fetchCategories();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
    <>
      <Sidebar />
      <Navbar />

      <div className="categories-page">

        <div className="categories-header">
          <h1>📂 Categories</h1>

          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setEditId(null);

              setFormData({
                category_name: "",
              });
            }}
          >
            <FaPlus /> Add Category
          </button>
        </div>

        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="3">No Categories Found</td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>

                  <td>{category.category_name}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(category)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(category.id)}
                    >
                      <FaTrash />
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

              <h2>
                {editId ? "Update Category" : "Add Category"}
              </h2>

              <input
                type="text"
                name="category_name"
                placeholder="Category Name"
                value={formData.category_name}
                onChange={handleChange}
              />

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
                    category_name: "",
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

export default Categories;