const bcrypt = require("bcrypt");
const User = require("../models/User.js")
const { createToken, verifyToken } = require("../middleware/jwt-middleware.js");


const saltRounds = 10;

async function register(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const foundUser = await User.findOne({ username }).exec();

        if (foundUser) {
            return res.status(409).json({ message: "Duplicate username. Change your username" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //const userId = await sqliteDB.insertUser(username, hashedPassword);
        const newUser = new User({
            username,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        res.status(201).json(savedUser)
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { username, password }= req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const foundUser = await User.findOne({ username }).exec()

        if (!foundUser) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const match = await bcrypt.compare(password, foundUser.password)


        if (!match) return res.status(401).json({ message: "Unauthorized" });

        const token = createToken({ userId: foundUser._id, username });

        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000, sameSite: 'None' ,secure: true });

        res.json({ success: true, message: 'Login successful', username });

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