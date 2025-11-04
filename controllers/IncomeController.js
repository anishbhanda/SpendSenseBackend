import Income from "../models/Income";

export default createIncome = async (req, res) => {
    try {
        const { source, amount, date } = req.body;

        if (!source || !amount || !date) {
            const missingFields = [];
            if (!source) missingFields.push("Income Source");
            if (!amount) missingFields.push("Amount");
            if (!date) missingFields.push("Date");

            return res.status(400).json({
                message:
                    missingFields.length === 3
                        ? "All fields are required"
                        : `${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required`,
            });
        }

        if (isNaN(amount) || amount <= 0) {
            return res.status(422).json({ message: "Amount must be a positive number" });
        }
        const newIncome = new Income({
            source, amount, date

        })
        await newIncome.save();
        res.status(201).json({ message: "Income created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while creating income" });
    }
};
