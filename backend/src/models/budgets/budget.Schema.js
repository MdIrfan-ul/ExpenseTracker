import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User",},
    category:{type:String,required:[true,"category is required"]},
    amount:{type:Number,required:[true,"amount is required"], min:[1,"minimum amount should be 1"]},

});

const BudgetModel = mongoose.model("Budget",BudgetSchema);


export {BudgetModel};