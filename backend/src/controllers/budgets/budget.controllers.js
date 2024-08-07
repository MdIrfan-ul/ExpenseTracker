import ApplicationError from "../../errorHandler/errorHandler.js";
import {
  checkBudgetExceed,
  createBudget,
  DeleteBudget,
  getBudget,
  updateBudget,
} from "../../models/budgets/budget.repository.js";

// Adding budget

export const AddBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, category } = req.body;
    const budget = await createBudget(userId, { amount, category });
    res
      .status(201)
      .json({ success: true, message: "Budget created successfully", budget });
  } catch (error) {
    if (error instanceof ApplicationError) {
      // Send error array directly
      res.status(error.code).json({ success: false, message: error.message });
  } else {
      res.status(500).json({ success: false, message: "Internal server error" });
  }
  }
};

// Getting Budget

export const FetchBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const budget = await getBudget(userId);
    res
      .status(200)
      .json({ success: true, message: "Budget Fetched successfully", budget });
  } catch (error) {
    res
      .status(error.code)
      .json({ success: false, message: `Failed:-${error.message}` });
  }
};

// Updating Budget

export const UpdatingBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { budgetId } = req.params;
    const { amount, category } = req.body;
    const budget = await updateBudget(userId, budgetId, { amount, category });
    res
      .status(200)
      .json({ success: true, message: "Budget updated successfully", budget });
  } catch (error) {
    if (error instanceof ApplicationError) {
      // Send error array directly
      res.status(error.code).json({ success: false, message: error.message });
  } else {
      res.status(500).json({ success: false, message: "Internal server error" });
  }
  }
};

// Remove Transaction

export const RemoveBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    await DeleteBudget(budgetId);
    res
      .status(200)
      .json({ success: true, message: "Budget Removed Successfully" });
  } catch (error) {
    res.status(error.code).json({ success: false, message: error.message });
  }
};

// Checking Budget Alerts
export const CheckBudgetAlerts = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.userEmail;
    const alerts = await checkBudgetExceed(userId, userEmail);
    if (alerts.length > 0) {
      res.status(200).json({
        success: true,
        message: "Alerts fetched successfully",
        alerts,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No budget alerts at this time",
        alerts: [],
      });
    }
  } catch (error) {
    res
      .status(error.code)
      .json({ success: false, message: `Failed: ${error.message}` });
  }
};
