const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Product routes
// This function will check that the requesting user is accessable or not
exports.protect = async (req, res, next) => {
    let token;

    // ฝังข้อมูลของ auth ไว้ที่ header เป็น syntax: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Get a token by splt to remove Bearer then get the token only
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists or it's null when user logout
    if (!token || token == 'null') {
        return res.status(401).json({
            success: false,
            message: 'Not authorize to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({
            success: false,
            message: 'Not authorize to access this route'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // กรณีที่ roles ที่รับมาไม่อยู่ใน list
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    }
}