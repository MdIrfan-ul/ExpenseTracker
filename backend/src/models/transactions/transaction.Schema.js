import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: [true, "title is required"],
    minLength: [5, "title should be minimum 5 characters"]
  },
  amount: { type: Number, required: [true, "amount is required"],min:[1,"minimum amount should be 1 "] },
  date: { type: Date, required: [true, "date is required"] },
  category: { type: String, required: [true, "category is required"], minLength:[5, "category should be minimum 5 characters"] },
  type: { type: String, enum: ["income", "expense"], required: [true,"Transaction type is required"] },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

export { TransactionModel };
