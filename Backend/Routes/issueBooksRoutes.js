const express = require("express");
const router = express.Router();

const issueBooksController = require("../controllers/issueBooksController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.get(
  "/",
  authMiddleware,
  issueBooksController.getAllIssueBooks
);
router.get(
  "/:id",
  authMiddleware,
  issueBooksController.getIssueBookById
);
router.post(
  "/",
  authMiddleware,
  issueBooksController.issueBook
);

// ======================================
// RETURN BOOK
// ======================================
router.put(
  "/return/:id",
  authMiddleware,
  issueBooksController.returnBook
);

// ======================================
// DELETE ISSUE RECORD
// ======================================
router.delete(
  "/:id",
  authMiddleware,
  issueBooksController.deleteIssueBook
);

module.exports = router;