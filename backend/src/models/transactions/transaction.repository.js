import ApplicationError from "../../errorHandler/errorHandler.js";
import { TransactionModel } from "./transaction.Schema.js";
import mongoose from "mongoose";
// Create Transaction in DB

export const createTransaction = async (userId, TransactionData) => {
  try {
    const newTransaction = new TransactionModel({
      user: userId,
      ...TransactionData,
    });
    return await newTransaction.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Convert validation errors to an array of messages
      const errors = Object.values(error.errors).map(err => err.message);
      throw new ApplicationError(errors, 400);
  }
  throw new ApplicationError(["An unexpected error occurred"], 500);
  }
};

// getting Transactions based on the userId
export const getTransaction = async (user) => {
    const Transactions = await TransactionModel.find({ user });
    return Transactions;
};

export const getTransactionById  = async (id)=>{
  return await TransactionModel.findById(id);
}


// Update Transaction in DB

export const updateTransactionById = async (
  TransactionId,
  userId,
  TransactionData
) => {
  try {
    const updateTransaction = await TransactionModel.findOneAndUpdate(
      { _id: TransactionId, user: userId },
      TransactionData,
      { new: true, runValidators: true }
    );
    return updateTransaction;
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Convert validation errors to an array of messages
      const errors = Object.values(error.errors).map(err => err.message);
      throw new ApplicationError(errors, 400);
  }
  throw new ApplicationError(["An unexpected error occurred"], 500);
  }
};

// Delete Transaction in DB

export const removeTransaction = async (id) => {
   return await TransactionModel.findByIdAndDelete(id);
    
};

// get category breakdown

export const getCategoryBreakdown = async (userId) => {
  try {
    const breakdown = await TransactionModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    ]);
    return breakdown;
  } catch (error) {
    throw error;
  }
};

export const getAnalyticsData = async (userId) => {
  try {
    const transactions = await TransactionModel.find({
      user: new mongoose.Types.ObjectId(userId),
    });
    // Example: Group transactions by month and calculate totals
    const analyticsData = transactions.reduce((acc, transaction) => {
      const month = transaction.date.getMonth();
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      return acc;
    }, {});
    // Convert the result to a more usable format for frontend
    const processedData = Object.keys(analyticsData).map((month) => ({
      month,
      income: analyticsData[month].income,
      expense: analyticsData[month].expense,
    }));
    return processedData;
  } catch (error) {
    throw error;
  }
};
