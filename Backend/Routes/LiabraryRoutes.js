const express = require("express");
const app = express();
const router = express.Router();

const {
  getAllBooks,
  SearchBooks,
  getBooksById,
  CreateBook,
  UpdateBook,
  DeleteBook,
} = require("../Controllers/LiabraryController");

router.get("/", getAllBooks);
router.get("/search", SearchBooks);
router.get("/:id", getBooksById);
router.post("/", CreateBook);
router.put("/:id", UpdateBook);
router.delete("/:id", DeleteBook);

module.exports = router;
