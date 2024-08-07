import express from "express";
import { AddBudget, CheckBudgetAlerts, FetchBudget, RemoveBudget, UpdatingBudget } from "../controllers/budgets/budget.controllers.js";

const BudgetRoutes = express.Router();

BudgetRoutes.post('/add',(req,res)=>{
    AddBudget(req,res);
});

BudgetRoutes.get('/',(req,res)=>{
    FetchBudget(req,res);
});

BudgetRoutes.put('/:budgetId',(req,res)=>{
UpdatingBudget(req,res);
});

BudgetRoutes.delete('/:budgetId',(req,res)=>{
    RemoveBudget(req,res);
});

// New route for budget alerts
BudgetRoutes.get('/alerts',(req, res) => {
    CheckBudgetAlerts(req, res);
});

export {BudgetRoutes};