exports.isAdmin = (req, res, next) => {

    if (req.user.role !== "Admin") {

        return res.status(403).json({
            success: false,
            message: "Only Admin Can Access"
        });

    }

    next();

};