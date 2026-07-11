const db = require("../config/db");

// =====================
// GET ALL STUDENTS
// =====================
exports.getAllStudents = (req, res) => {
  const sql = "SELECT * FROM students ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      students: result,
    });
  });
};

// =====================
// GET STUDENT BY ID
// =====================
exports.getStudentById = (req, res) => {
  const sql = "SELECT * FROM students WHERE id=?";

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
        message: "Student Not Found",
      });
    }

    res.json({
      success: true,
      student: result[0],
    });
  });
};

// =====================
// ADD STUDENT
// =====================
exports.addStudent = (req, res) => {
  const { name, email, phone, course, semester, address } = req.body;

  if (!name || !email || !phone || !course || !semester) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  const checkSql = "SELECT * FROM students WHERE email=?";

  db.query(checkSql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const sql = `
      INSERT INTO students
      (name,email,phone,course,semester,address)
      VALUES(?,?,?,?,?,?)
    `;

    db.query(
      sql,
      [name, email, phone, course, semester, address],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.status(201).json({
          success: true,
          message: "Student Added Successfully",
        });
      }
    );
  });
};

// =====================
// UPDATE STUDENT
// =====================
exports.updateStudent = (req, res) => {
  const { name, email, phone, course, semester, address } = req.body;

  const sql = `
    UPDATE students
    SET
      name=?,
      email=?,
      phone=?,
      course=?,
      semester=?,
      address=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, email, phone, course, semester, address, req.params.id],
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
          message: "Student Not Found",
        });
      }

      res.json({
        success: true,
        message: "Student Updated Successfully",
      });
    }
  );
};

// =====================
// DELETE STUDENT
// =====================
exports.deleteStudent = (req, res) => {
  const sql = "DELETE FROM students WHERE id=?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    res.json({
      success: true,
      message: "Student Deleted Successfully",
    });
  });
};

exports.searchStudents = (req, res) => {
  const keyword = req.query.keyword || "";

  const sql = `
    SELECT * FROM students
    WHERE
      name LIKE ?
      OR email LIKE ?
      OR phone LIKE ?
      OR course LIKE ?
  `;

  db.query(
    sql,
    [
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        students: result,
      });
    }
  );
};

exports.searchStudents = async (req, res) => {
  try {
    const { keyword } = req.query;

    const students = await Student.find({
      name: { $regex: keyword, $options: "i" },
    });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};