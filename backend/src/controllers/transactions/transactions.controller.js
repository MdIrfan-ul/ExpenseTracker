import ApplicationError from "../../errorHandler/errorHandler.js";
import { createTransaction, getAnalyticsData, getCategoryBreakdown, getTransaction, getTransactionById, removeTransaction, updateTransactionById } from "../../models/transactions/transaction.repository.js";



// Creating Transaction from DB

export const newTransaction = async(req,res)=>{
try {
    const userId = req.userId;
    const {title,amount,date,category,type}= req.body;
    const TransactionData= {title,amount,date,category,type};
    const newTransaction = await createTransaction(userId,TransactionData);
    res.status(201).json({success:true,message:"Transaction Created Successfully",Transactions:newTransaction});
} catch (error) {
    if (error instanceof ApplicationError) {
        // Send error array directly
        res.status(error.code).json({ success: false, message: error.message });
    } else {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
}


// Get Transaction from DB

export const fetchTransaction = async(req,res)=>{
    try{
        const userId = req.userId;
        const Transaction = await getTransaction(userId);
        if (!Transaction || Transaction.length === 0) {
            return res.status(200).json({success:true,message:"No Transaction found",Transactions:Transaction});
          }
        res.status(200).json({success:true,message:"Transaction fetched successfully",Transactions:Transaction});
    }catch(error){

        res.status(400).json({success:false,message:`Failed to Fetch`});
    }
}


// Update Transaction from DB
export const editTransaction = async(req,res)=>{
    try {
        const userId = req.userId;
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success:false,message:"Transaction ID not found"});
        }
        if(!userId){
            return res.status(401).json({success:false,message:"UnAuthorized: USER not found"});
        }
        const transaction = await getTransactionById(id);
        if(!transaction){
            return res.status(400).json({success:false,message:"Transaction not found"});
        }
        const {title,amount,date,category,type}= req.body;
        const TransactionData= {title,amount,date,category,type};
        const updatedTransaction = await updateTransactionById(id,userId,TransactionData);
        res.status(200).json({success:true,message:"Transaction updated successfully",Transactions:updatedTransaction});
    } catch (error) {
        if (error instanceof ApplicationError) {
            // Send error array directly
            res.status(error.code).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

// Remove Transaction from DB

export const deleteTransaction = async(req,res)=>{
    try {
        const { id } = req.params;

        // Check if the userId is available (if needed, since Auth middleware should handle this)
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
        }

        // Check if the transaction ID is valid
        if (!id) {
            return res.status(400).json({ success: false, message: "Transaction ID not found" });
        }
        const transaction = await getTransactionById(id);
        if(!transaction){
            return res.status(400).json({success:false,message:"NO transaction found"});
        }

        await removeTransaction(id);
        res.
        status(200).
        json({success: true, message:"Transaction Removed Successfully"});
      
    } catch (error) {

        res.status(error.code).json({success: false,message:error.message});
    }
}

// Get Category wise breakdown

export const CategoryBreakdown = async (req,res)=>{
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({success:false,message:"UnAuthorized"});
        }
        const breakdown = await getCategoryBreakdown(userId);
        res.status(200).json({success:true,message:"Category fetched successfull",breakdown});
    } catch (error) {

        res.status(400).json({success:false,message:`Failed to get breakdown:-${error.message}`});
    }
}

// Fetch Analytics Data

export const FetchAnalyticsData = async (req, res) => {
    try {
        const userId = req.userId;
        const analyticsData = await getAnalyticsData(userId);
        res.status(200).json({ success: true, message:"Analytics data fetched successfully", analyticsData });
    } catch (error) {

        res.status(400).json({ success: false, message: `Failed to fetch analytics data: ${error.message}` });
    }
};