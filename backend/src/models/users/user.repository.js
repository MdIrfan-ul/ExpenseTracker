import ApplicationError from "../../errorHandler/errorHandler.js";
import { userModel } from "./user.Schema.js";

export const createNewUser = async(userData)=>{
    try {
        const newUser = new userModel(userData)
        return await newUser.save();
    } catch (error) {
        if(error.code===11000){
            throw new ApplicationError(["User is already Registered continue to login"],400);
        }else if (error.name === 'ValidationError') {
            // Convert validation errors to an array of messages
            const errors = Object.values(error.errors).map(err => err.message);
            throw new ApplicationError(errors, 400);
        }
        throw new ApplicationError(["An unexpected error occurred"], 500);
}
}


export const findByEmail = async(email)=>{
try {
    const user = await userModel.findOne({email});
    return user;
} catch (error) {
    throw error;
}
}

export const getUsersById = async (userId)=>{
    try {
        const user = await userModel.findById(userId).select('-password'); 
        return user;
    } catch (error) {
        throw error;
    }
}

export const getUsers = async ()=>{
    try {
        return await userModel.find();
    } catch (error) {
        throw error;
    }
}