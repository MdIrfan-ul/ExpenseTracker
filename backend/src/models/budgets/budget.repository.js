import { BudgetModel } from "./budget.Schema.js"
import { TransactionModel } from "../../models/transactions/transaction.Schema.js";
import mongoose from "mongoose";
import { sendBudgetAlertEmail } from "../../middlewares/alertMail.middleware.js";
import ApplicationError from "../../errorHandler/errorHandler.js";

// Creating Budget

export const createBudget = async(userId,budgetData)=>{
    try {
        const existingBudget = await BudgetModel.findOne({ user: userId, category: budgetData.category });
        if (existingBudget) {
            // Update the existing budget
            Object.assign(existingBudget, budgetData);
            return await existingBudget.save();
        } else {
            // Create a new budget
            const budget = new BudgetModel({ user: userId, ...budgetData });
            return await budget.save();
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Convert validation errors to an array of messages
            const errors = Object.values(error.errors).map(err => err.message);
            throw new ApplicationError(errors, 400);
        }
        throw new ApplicationError(["An unexpected error occurred"], 500);
    
    }
};

// Getting Budget

export const getBudget = async (user)=>{
    try {
        const budget = BudgetModel.find({user});
        if(!budget || budget.length===0){
            throw new ApplicationError("No budget found",400);
        }
        return budget;
    } catch (error) {
    }
}

// Update Budget

export const updateBudget = async(userId,budgetId,budgetData)=>{
    try {
        if(!budgetId){
            throw new ApplicationError("No budget Present for the given id",400);
        }
        const budget = await BudgetModel.findOneAndUpdate({_id:budgetId,user:userId},budgetData,{new:true,runValidators:true});
        if(!budget){
            throw new ApplicationError("No budget Present for the given id",400);
        }
        return budget;  
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Convert validation errors to an array of messages
            const errors = Object.values(error.errors).map(err => err.message);
            throw new ApplicationError(errors, 400);
        }
        throw new ApplicationError(["An unexpected error occurred"], 500);
    

    }
};

// Delete Budget

export const DeleteBudget = async (budgetId)=>{
    try {
        const removeBudget = await BudgetModel.findByIdAndDelete(budgetId);
        if(!removeBudget){
            throw new ApplicationError("No Budget Present for the given Id",400);
        }

    } catch (error) {
        throw error;
    }
};




// Check if expenses exceed the budget
export const checkBudgetExceed = async (userId,userEmail) => {
    try {
        const budgets = await BudgetModel.find({ user: new mongoose.Types.ObjectId(userId) });
        const alerts = [];

        for (const budget of budgets) {

            const totalExpenses = await TransactionModel.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(userId), category: budget.category, type: "expense" } },
                { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }
            ]);
            if (totalExpenses.length > 0) {
                const categoryTotal = totalExpenses[0].totalAmount;
                const threshold = budget.amount * 0.9; // 90% of budget


                if (categoryTotal > threshold) {
                    alerts.push({ category: budget.category, budget: budget.amount, totalExpenses: categoryTotal });

                    // Send email alert
                    await sendBudgetAlertEmail(userEmail, budget.category, budget.amount, categoryTotal);
                }
            }
        }
        return alerts;
    } catch (error) {
        throw new ApplicationError('Error checking budget exceed',400);
    }
};
