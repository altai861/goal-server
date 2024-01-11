const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createToken, verifyToken } = require("../middleware/jwt-middleware.js");
const sqliteDB = require("../middleware/sqlite-middleware.js");


const saltRounds = 10;

async function register(req, res) {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userId = await sqliteDB.insertUser(username, hashedPassword);

        if (typeof userId === 'object') {
            return res.status(400).json({ success: true, message: "Duplicate username, change the username" })
        }

        const token = createToken({ userId, username });

        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000/*, sameSite: 'None' ,secure: true*/ });

        res.status(201).json({ success: true, message: "Registration successful" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { username, password }= req.body;

        const user = await sqliteDB.getUserByUsername(username);

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = createToken({ userId: user.userId, username });

            res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000/*, sameSite: 'None' ,secure: true*/ });

                res.json({ success: true, message: 'Login successful', username });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials asdas" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

function logout(req, res) {
    res.clearCookie('token');
    res.json({ success: true, message: "Logout successful" });
}

module.exports = {
    register, 
    login,
    logout
}