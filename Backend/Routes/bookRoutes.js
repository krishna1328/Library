const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Search & Filter
router.get("/category/:category", authMiddleware, bookController.getBooksByCategory);

// CRUD
router.get("/categories", authMiddleware, bookController.getCategories);
router.get("/search", authMiddleware, bookController.searchBooks);
router.get("/", authMiddleware, bookController.getAllBooks);
router.get("/:id", authMiddleware, bookController.getBookById);


router.post("/", bookController.addBook);
router.put("/:id", authMiddleware, isAdmin, bookController.updateBook);
router.delete("/:id", authMiddleware, bookController.deleteBook);

module.exports = router;