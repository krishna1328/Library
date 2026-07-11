const db = require("../config/db");

exports.getDashboardData = (req, res) => {

    const dashboard = {};

    db.query("SELECT COUNT(*) AS totalBooks FROM books", (err, books) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        dashboard.totalBooks = books[0].totalBooks;

        db.query("SELECT COUNT(*) AS totalStudents FROM students", (err, students) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            dashboard.totalStudents = students[0].totalStudents;

            db.query("SELECT COUNT(*) AS totalCategories FROM categories", (err, categories) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                dashboard.totalCategories = categories[0].totalCategories;

                db.query("SELECT COUNT(*) AS issuedBooks FROM issued_books WHERE status='Issued'", (err, issue) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    dashboard.issuedBooks = issue[0].issuedBooks;

                    res.json({
                        success: true,
                        dashboard
                    });

                });

            });

        });

    });

};