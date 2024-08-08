import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./userReducer";

const initialState = {
    budgets:[],
    loading:false,
    alerts:[],
    error:null
};


// fetch Budgets

export const fetchBudgets = createAsyncThunk("budget/fetchBudget",async(_,{dispatch,rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://expensetracker-i0in.onrender.com/budgets/',{headers:{Authorization:token}});
        const {data} = response;
        const {budget} = data;
        return budget;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("Session Ended");
        }
      return rejectWithValue(error.response.data.message);
    }
});


// Adding New Budget
export const addBudget = createAsyncThunk("budget/addBudget",async(budgetData,{dispatch,rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`https://expensetracker-i0in.onrender.com/budgets/add`,budgetData,{headers:{Authorization:token}});
        const {data} = response;
        const {budget} = data;
        return budget;

    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("Session Ended");
        }
      return rejectWithValue(error.response.data.message);
    }
});

// Updating Budget 

export const updateBudget =createAsyncThunk('budget/updateBudget',async({id,budgetData},{dispatch,rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`https://expensetracker-i0in.onrender.com/budgets/${id}`,budgetData,{headers:{Authorization:token}});
        const {data} = response;
        const {budget} = data;
        return budget;
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("Session Ended");
        }
      return rejectWithValue(error.response.data.message);
    }
});

// delete budget

export const deleteBudget = createAsyncThunk("budget/deleteBudget",async(id,{rejectWithValue})=>{
try {
    const token = localStorage.getItem('token');
    await axios.delete(`https://expensetracker-i0in.onrender.com/budgets/${id}`,{headers:{Authorization:token}});
   return id;
} catch (error) {
    if (error.response && error.response.status === 401) {
        return rejectWithValue("Session Ended");
  }
  return rejectWithValue(error.response.data.message);
}
});

// Check for alerts

export const checkAlerts = createAsyncThunk("budget/fetchAlerts",async(_,{rejectWithValue})=>{
    try {
        const token = localStorage.getItem('token');
        const response =  await axios.get(`https://expensetracker-i0in.onrender.com/budgets/alerts`,{headers:{Authorization:token}});
        const {data} = response; 
        return data.alerts;

    } catch (error) {
        if (error.response && error.response.status === 401) {
            return rejectWithValue("Session Ended");
      }
      return rejectWithValue(error.response.data.message);
    }
})


const budgetSlice = createSlice({
    name:"budget",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchBudgets.pending,(state)=>{
            state.loading= true;
            state.error = null;
        }).addCase(fetchBudgets.fulfilled,(state,action)=>{
            state.loading= false;
            state.budgets = action.payload;
            state.error = null;
        }).addCase(fetchBudgets.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        }).addCase(addBudget.fulfilled,(state,action)=>{
            state.loading = false;
            const existingIndex = state.budgets.findIndex(budget => budget._id === action.payload._id);
            if (existingIndex >= 0) {
                state.budgets[existingIndex] = action.payload;
            } else {
                state.budgets.push(action.payload);
            }
            state.error = null;
        }).addCase(addBudget.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        }).addCase(updateBudget.fulfilled,(state,action)=>{
            const updatedBudget = action.payload;
            state.budgets = state.budgets.map((budget) =>
                budget._id === updatedBudget._id ? updatedBudget : budget
            );
        }).addCase(updateBudget.rejected,(state,action)=>{
            state.error = action.payload;
        }).addCase(deleteBudget.fulfilled,(state,action)=>{
            const id = action.payload;
            state.budgets = state.budgets.filter((budget)=>budget._id !==id)
        }).addCase(deleteBudget.rejected,(state,action)=>{
            state.error = action.payload;
        }).addCase(checkAlerts.pending,(state)=>{
            state.error = null;
        }).addCase(checkAlerts.fulfilled,(state,action)=>{
            state.alerts = action.payload;
            state.error = null;
        }).addCase(checkAlerts.rejected,(state,action)=>{
            state.error = action.payload;
        })
    }
});

export const budgetReducer = budgetSlice.reducer;
