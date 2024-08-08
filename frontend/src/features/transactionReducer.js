import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./userReducer";


const initialState = {
    transactions: [],
    categoryBreakdown: [],
    analyticsData: [],
    loading: false,
    error: null
}

// Creating Transactions

export const createTransaction = createAsyncThunk("transaction/create",async(transactionData,{rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`https://expensetracker-i0in.onrender.com/transactions/add`,transactionData,{headers:{Authorization:token}});
        const {data} = response;
        return data.Transactions;
    } catch (error) {
        if (error.response && error.response.status === 401) {
              return rejectWithValue("Session Ended");
        }
        if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
            return rejectWithValue(error.response.data.message);
        }
    }
});

// Getting Transactions

export const fetchTransaction = createAsyncThunk("transaction/get",async(_,{dispatch,rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://expensetracker-i0in.onrender.com/transactions`,{headers:{Authorization:token}});
        const {data} = response;
        const {Transactions} = data;
        return Transactions;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("Session Ended");
        }
      return rejectWithValue(error.response.data.message);
    }
});

// Update Transaction

export const updateTransaction = createAsyncThunk("transaction/updateTransaction",async({id,transactionData},{rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`https://expensetracker-i0in.onrender.com/transactions/${id}`,transactionData,{headers:{Authorization:token}});
        const {data} = response;
        return data.Transactions;
    } catch (error) {
        if (error.response && error.response.status === 401) {
              return rejectWithValue("Session Ended");
        }
        if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
            return rejectWithValue(error.response.data.message);
        }
    }
});

export const deleteTransaction = createAsyncThunk("transaction/deleteTransaction",async(id,{rejectWithValue})=>{
try {
    const token = localStorage.getItem('token');
    await axios.delete(`https://expensetracker-i0in.onrender.com/transactions/${id}`,{headers:{Authorization:token}});
   return id;
} catch (error) {
    if (error.response && error.response.status === 401) {
          return rejectWithValue("Session Ended");
    }
    return rejectWithValue(error.response.data.message);
}
})


// Fetch Category Breakdown
export const fetchCategoryBreakdown = createAsyncThunk("transaction/categoryBreakdown", async (_, { dispatch,rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://expensetracker-i0in.onrender.com/transactions/categorybreakdown`, { headers: { Authorization: token } });
        const { data } = response;
        const {breakdown} = data;
        return breakdown;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("Session Ended");
        }
        return rejectWithValue(error.response.data.message);
    }
});

// Fetch Analytics Data
export const fetchAnalyticsData = createAsyncThunk("transaction/analyticsData", async (_, {dispatch, rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://expensetracker-i0in.onrender.com/transactions/analyticsdata`, { headers: { Authorization: token } });
        const { data } = response;
        const {analyticsData} = data;
        return analyticsData;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("Session Ended");
        }
        return rejectWithValue(error.response.data.message);
    }
});


const transactionSlice = createSlice({
    name:"transaction",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        // Fetch Transaction
        builder.addCase(fetchTransaction.pending,(state,action)=>{
            state.loading = true;
            state.error = null;
        }).addCase(fetchTransaction.fulfilled,(state,action)=>{
            state.loading = false;
            state.transactions = action.payload;
            state.error = null;
        }).addCase(fetchTransaction.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            // Add Transaction
        }).addCase(createTransaction.fulfilled,(state,action)=>{
            state.transactions.push(action.payload);
            state.error = null;
        }).addCase(createTransaction.rejected,(state,action)=>{
            state.error = action.payload;
            // Update Transaction
        }).addCase(updateTransaction.pending,(state,action)=>{
            state.loading = true;
            state.error = null;
        }).addCase(updateTransaction.fulfilled,(state,action)=>{
            state.loading = false;
            const updatedTransaction = action.payload;
                state.transactions = state.transactions.map((transaction) =>
                    transaction._id === updatedTransaction._id ? updatedTransaction : transaction
                );

        }).addCase(updateTransaction.rejected,(state,action)=>{
            state.error = action.payload;
            // Delete Transaction
        }).addCase(deleteTransaction.fulfilled,(state,action)=>{
            const id = action.payload;
            state.transactions = state.transactions.filter((transaction)=>transaction._id!==id);
        }).addCase(deleteTransaction.rejected,(state,action)=>{
            state.error = action.payload;
            // Category Breakdown
        }).addCase(fetchCategoryBreakdown.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchCategoryBreakdown.fulfilled, (state, action) => {
            state.loading = false;
            state.categoryBreakdown=action.payload;
            state.error = null;
        })
        .addCase(fetchCategoryBreakdown.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // Analytics Data
        }).addCase(fetchAnalyticsData.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchAnalyticsData.fulfilled, (state, action) => {
            state.loading = false;
            state.analyticsData = action.payload;
            state.error = null;
        }).addCase(fetchAnalyticsData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});


const transactionReducer = transactionSlice.reducer;

export {transactionReducer};