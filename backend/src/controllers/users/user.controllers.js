import { createNewUser, findByEmail, getUsersById } from "../../models/users/user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApplicationError from "../../errorHandler/errorHandler.js";


// register

export const register = async(req,res)=>{
try {
    let name= req.body.name;
    let email=  req.body.email;
    let password = req.body.password;
    await createNewUser({name,email,password});
    res.status(201).json({success:true,message:"new User registered"})
} catch (error) {
    if (error instanceof ApplicationError) {
        // Send error array directly
        res.status(error.code).json({ success: false, message: error.message });
    } else {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
}

// Login


export const Login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await findByEmail(email);
        if(!user){
           return res.status(400).json({success:false,message:"Please enter valid email"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid Auth/Credentials"});
        }
        const token = jwt.sign({ id: user._id ,email:user.email}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });

    }catch(error){
        res.status(400).json({success:false,message:"failed to login"});
    }
}

// Fetch User By Id 

export const FetchUserById  = async (req,res)=>{
    try {
        const userId= req.userId;
        const user = await getUsersById(userId);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }  
        res.status(200).json({success:true,message:"Fetched user successfully",user});
    } catch (error) {
        res.status(400).json({success:false,message:"Failed to fetch"});
    }
}