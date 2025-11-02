import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: !email && !password
                    ? "Please enter all fields"
                    : !email
                        ? "Please enter your email"
                        : "Please enter your password",
            });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error during signup" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: !email && !password
                    ? "Please enter all fields"
                    : !email
                        ? "Please enter your email"
                        : "Please enter your password",
            });
        }

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: `User not found with email: ${email}` });
        }

        const passwordIsMatched = await bcrypt.compare(password, user.password);
        if (!passwordIsMatched) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const accessToken = signAccessToken({ id: user._id, email: user.email });
        const refreshToken = signRefreshToken({ id: user._id });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error during login" });
    }
};
