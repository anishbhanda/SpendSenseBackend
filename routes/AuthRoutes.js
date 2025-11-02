import express from "express"
import { verifyAccessToken } from "../utils/jwt.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { signup, login } from "../controllers/AuthController.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.get("/check", authMiddleware, (req, res) => {
    res.json({ message: "Access granted ✅", user: req.user });
});

export default router