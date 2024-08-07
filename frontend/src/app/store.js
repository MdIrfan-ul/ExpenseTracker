import {configureStore} from "@reduxjs/toolkit";
import { userReducer } from "../features/userReducer";
import { transactionReducer } from "../features/transactionReducer";
import { budgetReducer } from "../features/budgetReducer";

export const store = configureStore({
    reducer:{
        user:userReducer,
        transaction:transactionReducer,
        budget:budgetReducer
    }

})