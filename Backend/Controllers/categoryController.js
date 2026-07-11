const db = require("../config/db");

// =====================
// GET ALL CATEGORIES
// =====================
exports.getAllCategories = (req, res) => {

    const sql = "SELECT * FROM categories";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            categories: result
        });

    });

};

// =====================
// GET CATEGORY BY ID
// =====================
exports.getCategoryById = (req, res) => {

    const sql = "SELECT * FROM categories WHERE id=?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            });
        }

        res.json({
            success: true,
            category: result[0]
        });

    });

};

// =====================
// ADD CATEGORY
// =====================
exports.addCategory = (req, res) => {

    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({
            success: false,
            message: "Category Name is Required"
        });
    }

    const sql = "INSERT INTO categories(category_name) VALUES(?)";

    db.query(sql, [category_name], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Category Added Successfully"
        });

    });

};

// =====================
// UPDATE CATEGORY
// =====================
exports.updateCategory = (req, res) => {

    const { category_name } = req.body;

    const sql = `
    UPDATE categories
    SET category_name=?
    WHERE id=?
    `;

    db.query(sql, [category_name, req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            });
        }

        res.json({
            success: true,
            message: "Category Updated Successfully"
        });

    });

};

// =====================
// DELETE CATEGORY
// =====================
exports.deleteCategory = (req, res) => {

    const sql = "DELETE FROM categories WHERE id=?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found"
            });
        }

        res.json({
            success: true,
            message: "Category Deleted Successfully"
        });

    });

};