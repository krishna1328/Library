import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import API from "../../Services/api";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= Fetch Books =================
  const fetchBooks = async () => {
    try {
      const res = await API.get("/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.books || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/books/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= Search =================
  const handleSearch = async (keyword) => {
    try {
      const res = await API.get(`/books/search?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.books || []);
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      fetchBooks();
    } else {
      handleSearch(search);
    }
  }, [search]);

  // ================= Save / Update =================
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.author || !formData.isbn) {
        alert("Please fill all fields");
        return;
      }

      if (editId) {
        await API.put(`/books/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Book Updated Successfully");
      } else {
        await API.post("/books", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Book Added Successfully");
      }

      setShowModal(false);
      setEditId(null);

      setFormData({
        title: "",
        author: "",
        isbn: "",
      });

      fetchBooks();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // ================= Edit =================
  const handleEdit = (book) => {
    setEditId(book.id);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
    });

    setShowModal(true);
  };

  // ================= Delete =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await API.delete(`/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Book Deleted Successfully");

      fetchBooks();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const handleCategoryFilter = async (categoryId) => {
    if (categoryId === "") {
      fetchBooks();
      return;
    }

    try {
      const res = await API.get(`/books/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.books);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Sidebar />
      <Navbar />

      <div className="books-page">
        <div className="books-header">
          <h1>📚 Books</h1>

          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setEditId(null);

              setFormData({
                title: "",
                author: "",
                isbn: "",
              });
            }}
          >
            <FaPlus /> Add Book
          </button>
        </div>

        <div className="books-filters">

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleCategoryFilter(e.target.value);
            }}
          >
            <option value="">All Categories</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by Title, Author or ISBN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>

                <td>
                  <button className="edit-btn" onClick={() => handleEdit(book)}>
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(book.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editId ? "Update Book" : "Add Book"}</h2>

              <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={formData.title}
                onChange={handleChange}
              />

              <input
                type="text"
                name="author"
                placeholder="Author Name"
                value={formData.author}
                onChange={handleChange}
              />

              <input
                type="text"
                name="isbn"
                placeholder="ISBN"
                value={formData.isbn}
                onChange={handleChange}
              />

              <button className="save-btn" onClick={handleSubmit}>
                {editId ? "Update" : "Save"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);

                  setFormData({
                    title: "",
                    author: "",
                    isbn: "",
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

export default Books;
