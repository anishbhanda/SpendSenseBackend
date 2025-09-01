import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

// Signup controller
export const signup = async (req, res) => {
    try {

        console.log("req.body");
        console.log(req.body);

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: !username && !password
                    ? "Please enter all fields"
                    : !username
                        ? "Please enter your username"
                        : "Please enter your password",
            });
        }

        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this username already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error during signup" });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: !username && !password
                    ? "Please enter all fields"
                    : !username
                        ? "Please enter your username"
                        : "Please enter your password",
            });
        }

        const user = await Users.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: `User not found with username: ${username}` });
        }

        const passwordIsMatched = await bcrypt.compare(password, user.password);
        if (!passwordIsMatched) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const accessToken = signAccessToken({ id: user._id, username: user.username });
        const refreshToken = signRefreshToken({ id: user._id });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { id: user._id, username: user.username },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error during login" });
    }
};
