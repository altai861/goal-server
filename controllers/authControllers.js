const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(400).json({ message: "Unauthorized" });
    } else {
        const match = await bcrypt.compare(password, foundUser.password)
        if (!match) {
            return res.status(401).json({ message: "Unauthorized" });
        }        
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": foundUser._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        )
        const refreshToken = jwt.sign(
            { "userId": foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({ accessToken })
    }

}

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ username }).exec();
    if (foundUser) {
        return res.status(400).json({ message: "Duplicate username detected" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        password: passwordHash
    })
    const savedUser = await newUser.save();
    return res.status(201).json({ message: "New user created", userId: `${savedUser._id}` });

}

const refresh = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            console.log(decoded)
            const foundUser = await User.findOne({ _id: decoded.userId }).exec();
            if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userId": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )

            res.json({ accessToken })
        }
    )
}


const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'/*, secure: True */ })
    res.json({ message: "Cookie cleared" });
}

module.exports = {
    login, 
    register,
    refresh,
    logout
}