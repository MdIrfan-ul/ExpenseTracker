import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
loading:false,
user:null,
isAuthenticated: !!localStorage.getItem('token'),
token: localStorage.getItem('token'),
error:null,
}


// Fetch user data using the stored token
export const fetchUser = createAsyncThunk("user/fetchUser", async (_, { getState,dispatch, rejectWithValue }) => {
    const token = getState().user.token;
    try {
      const response = await axios.get(`https://expensetracker-i0in.onrender.com/users/me`, {
        headers: { Authorization: token },
      });
      const {data} = response;
      return data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(logout());
            return rejectWithValue("");
        }
      return rejectWithValue(error.response.data.message);
    }
  });

// Registering user
export const register = createAsyncThunk("user/register",async({name,email,password},{rejectWithValue})=>{
    try {
        const response = await axios.post(`https://expensetracker-i0in.onrender.com/users/register`,{name,email,password});
        const {data} = response;
        return data;
    } catch (error) {
        if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
            return rejectWithValue(error.response.data.message);
        }
    }
});

// Login 
export const Login = createAsyncThunk("user/login",async({email,password},{rejectWithValue})=>{
    try {
        const response= await axios.post(`https://expensetracker-i0in.onrender.com/users/login`,{email,password});
        const {data} = response;
        localStorage.setItem('token',data.token);
        return data.token;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})


const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        resetError:(state)=>{
        state.error=null;
        },
        logout:(state)=>{
            state.user = null;
            state.error = null;
            state.isAuthenticated=false;
            state.token = null;
            localStorage.removeItem('token');
        },
        setAuthenticated: (state) => {
            state.isAuthenticated = true;
          }
    },
    extraReducers:(builder)=>{
        builder.addCase(register.pending,(state)=>{
            state.loading= true;
            state.error = null;
        }).addCase(register.fulfilled,(state,action)=>{
            state.loading=false;
            state.user = action.payload;
            state.error= null;
        }).addCase(register.rejected,(state,action)=>{
            state.loading= false;
            state.error = action.payload;
        }).addCase(Login.pending,(state)=>{
            state.loading = true;
            state.error=null;
        })
        .addCase(Login.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload;
            state.error = null;
        }).addCase(Login.rejected,(state,action)=>{
            state.loading=false;
            state.isAuthenticated=false;
            state.error = action.payload;
        }).addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
          })
          .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
            });
    }

});



const userReducer = userSlice.reducer;

export const {resetError,logout,setAuthenticated} = userSlice.actions;

export {userReducer};