import "./env.js";
import express from "express";
import cors from "cors";
import { connectUsingMongoose } from "./config/mongoose.db.js";
import { UserRoutes } from "./src/routes/user.routes.js";
import Auth from "./src/middlewares/jwtAuth.middleware.js";
import {TransactionRoutes} from "./src/routes/transaction.routes.js"
import { BudgetRoutes } from "./src/routes/budget.routes.js";
import "./src/services/cronJobs.js";
import ApplicationError from "./src/errorHandler/errorHandler.js";

const app =  express();
app.use(express.json());

const corsOptions = {
origin:"https://expnsetrakr.netlify.app/",
}

app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.json({"greet":"welcome to Expense Tracker"});
});


// User Routes

app.use("/users",UserRoutes);

// Transaction Routes

app.use("/transactions",Auth,TransactionRoutes);

// budget Routes

app.use("/budgets",Auth,BudgetRoutes);


app.use((req,res)=>{
    res.status(404).json("API Not Found. Please Verify the Document to know More Information at https://documenter.getpostman.com/view/33021592/2sA3kdBdih");
})

app.use((err,req,res,next)=>{
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }else {
        // Server Error
        res.status(500).send("Something Went Wrong Please Try Again Later");
    }
    })

app.listen(process.env.PORT,(req,res)=>{
    connectUsingMongoose();
    console.log("server is listening at localhost:8000");
})