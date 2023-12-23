const { verifyToken } = require("./jwt-middleware.js");

function authenticateUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: Token not provided" })
    }

    const decoded = verifyToken(token);
    console.log(decoded?.userId);
    if (!decoded) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    req.user = { userId: decoded.userId };

    next();

}

module.exports = { authenticateUser }