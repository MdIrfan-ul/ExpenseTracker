import express from "express";
import {  fetchTransaction,   newTransaction, editTransaction, deleteTransaction, CategoryBreakdown, FetchAnalyticsData } from "../controllers/transactions/transactions.controller.js"



const TransactionRoutes = express.Router();

TransactionRoutes.post("/add",(req,res)=>{
newTransaction(req,res);
});

TransactionRoutes.get("/",(req,res)=>{
    fetchTransaction(req,res);
});

TransactionRoutes.put("/:id",(req,res)=>{
    editTransaction(req,res);
})

TransactionRoutes.delete("/:id",(req,res)=>{
    deleteTransaction(req,res);
});

TransactionRoutes.get("/categorybreakdown",(req,res)=>{
    CategoryBreakdown(req,res);
});

TransactionRoutes.get("/analyticsdata", (req, res) => {
    FetchAnalyticsData(req, res);
});


export {TransactionRoutes};