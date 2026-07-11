const db = require("../config/db");
// ====================
// GET ALL BOOKS
// ====================
exports.getAllBooks = (req, res) => {
  const sql = `
        SELECT books.*, categories.category_name
        FROM books
        LEFT JOIN categories
        ON books.category_id = categories.id
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
      books: result,
    });
  });
};

// ====================
// GET BOOK BY ID
// ====================
exports.getBookById = (req, res) => {
  const sql = "SELECT * FROM books WHERE id=?";

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
        message: "Book Not Found",
      });
    }

    res.json({
      success: true,
      book: result[0],
    });
  });
};

// ====================
// ADD BOOK
// ====================
exports.addBook = (req, res) => {
  console.log("Body:", req.body);

  const { title, author, isbn } = req.body;

  const sql = `
    INSERT INTO books
    (title, author, isbn, category_id, publisher, publish_year, quantity, available_quantity, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author,
      isbn,
      1,
      "",
      2025,
      1,
      1,
      "",
    ],
    (err, result) => {
      console.log("MySQL Error:", err);
      console.log("Result:", result);

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Book Added Successfully",
      });
    }
  );
};
// ====================
// UPDATE BOOK
// ====================
exports.updateBook = (req, res) => {
  const {
    title,
    author,
    isbn,
    category_id,
    publisher,
    publish_year,
    quantity,
    available_quantity,
    description,
  } = req.body;

  const sql = `
    UPDATE books SET
    title=?,
    author=?,
    isbn=?,
    category_id=?,
    publisher=?,
    publish_year=?,
    quantity=?,
    available_quantity=?,
    description=?
    WHERE id=?
    `;

  db.query(
    sql,
    [
      title,
      author,
      isbn,
      category_id,
      publisher,
      publish_year,
      quantity,
      available_quantity,
      description,
      req.params.id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Book Updated Successfully",
      });
    },
  );
};

// ====================
// DELETE BOOK
// ====================
exports.deleteBook = (req, res) => {

  console.log("Delete ID:", req.params.id);

  const sql = "DELETE FROM books WHERE id=?";

  db.query(sql, [req.params.id], (err, result) => {

    console.log("Error:", err);
    console.log("Result:", result);

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      message: "Book Deleted Successfully",
    });

  });

};

// ====================
// SEARCH BOOK
// ====================
exports.searchBooks = (req, res) => {

  const { keyword } = req.query;

  const sql = `
    SELECT * FROM books
    WHERE title LIKE ?
    OR author LIKE ?
    OR isbn LIKE ?
  `;

  db.query(
    sql,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        books: result,
      });

    }
  );

};
// ====================
// FILTER BY CATEGORY
// ====================
exports.getBooksByCategory = (req, res) => {
  const sql = `
    SELECT books.*, categories.category_name
    FROM books
    JOIN categories
    ON books.category_id = categories.id
    WHERE categories.category_name=?
    `;

  db.query(sql, [req.params.category], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      books: result,
    });
  });
};
// ====================
// GET ALL CATEGORIES
// ====================
exports.getCategories = (req, res) => {

  const sql = "SELECT * FROM categories";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      categories: result,
    });

  });

};

exports.getBooksByCategory = (req, res) => {

  const sql = "SELECT * FROM books WHERE category_id=?";

  db.query(sql,[req.params.category],(err,result)=>{

      if(err){
          return res.status(500).json({
              success:false,
              message:err.message
          });
      }

      res.json({
          success:true,
          books:result
      });

  });

};