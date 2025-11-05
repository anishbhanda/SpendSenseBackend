import express from "express"
import { createIncome } from "../controllers/IncomeController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/", authMiddleware, createIncome)

export default router