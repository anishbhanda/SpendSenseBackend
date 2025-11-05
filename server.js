import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/AuthRoutes.js"
import incomeRoutes from "./routes/IncomeRoutes.js"
import connectDB from "./config/db.js"
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();


const app = express();
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes)

app.use("/api/income", incomeRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))