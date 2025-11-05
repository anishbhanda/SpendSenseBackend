import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: [true, "Income source is required"],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export default mongoose.model("Income", incomeSchema);
