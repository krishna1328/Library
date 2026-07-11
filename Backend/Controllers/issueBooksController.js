const db = require("../config/db");

// =====================================
// GET ALL ISSUE BOOKS
// =====================================
exports.getAllIssueBooks = (req, res) => {
  const sql = `
    SELECT
      ib.*,
      s.name AS student_name,
      b.title AS book_title
    FROM issued_books ib
    JOIN students s ON ib.student_id = s.id
    JOIN books b ON ib.book_id = b.id
    ORDER BY ib.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      issueBooks: result,
    });
  });
};

// =====================================
// GET ISSUE BOOK BY ID
// =====================================
exports.getIssueBookById = (req, res) => {
  const sql = `
    SELECT
      ib.*,
      s.name AS student_name,
      b.title AS book_title
    FROM issued_books ib
    JOIN students s ON ib.student_id = s.id
    JOIN books b ON ib.book_id = b.id
    WHERE ib.id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue Record Not Found",
      });
    }

    res.json({
      success: true,
      issueBook: result[0],
    });
  });
};

// =====================================
// ISSUE BOOK
// =====================================
exports.issueBook = (req, res) => {
  const { student_id, book_id, issue_date, due_date } = req.body;

  if (!student_id || !book_id || !issue_date || !due_date) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  db.query(
    "SELECT * FROM books WHERE id = ?",
    [book_id],
    (err, books) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (books.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Book Not Found",
        });
      }

      if (books[0].available_quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Book Not Available",
        });
      }

      const insertSql = `
        INSERT INTO issued_books
        (
          student_id,
          book_id,
          issue_date,
          due_date,
          status,
          fine
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          student_id,
          book_id,
          issue_date,
          due_date,
          "Issued",
          0,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          db.query(
            "UPDATE books SET available_quantity = available_quantity - 1 WHERE id = ?",
            [book_id]
          );

          res.status(201).json({
            success: true,
            message: "Book Issued Successfully",
          });
        }
      );
    }
  );
};

// =====================================
// RETURN BOOK
// =====================================
exports.returnBook = (req, res) => {
  const issueId = req.params.id;

  db.query(
    "SELECT * FROM issued_books WHERE id = ?",
    [issueId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Issue Record Not Found",
        });
      }

      const issue = result[0];

      const today = new Date();
      const dueDate = new Date(issue.due_date);

      let fine = 0;

      if (today > dueDate) {
        const lateDays = Math.ceil(
          (today - dueDate) / (1000 * 60 * 60 * 24)
        );

        fine = lateDays * 10;
      }

      db.query(
        `
        UPDATE issued_books
        SET
          return_date = ?,
          status = ?,
          fine = ?
        WHERE id = ?
        `,
        [
          today.toISOString().split("T")[0],
          "Returned",
          fine,
          issueId,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          db.query(
            "UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?",
            [issue.book_id]
          );

          res.json({
            success: true,
            message: "Book Returned Successfully",
            fine,
          });
        }
      );
    }
  );
};

// =====================================
// DELETE ISSUE BOOK
// =====================================
exports.deleteIssueBook = (req, res) => {
  db.query(
    "DELETE FROM issued_books WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Issue Record Not Found",
        });
      }

      res.json({
        success: true,
        message: "Issue Record Deleted Successfully",
      });
    }
  );
};