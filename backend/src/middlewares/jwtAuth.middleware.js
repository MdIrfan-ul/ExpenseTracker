import jwt  from "jsonwebtoken";

const Auth = (req,res,next)=>{
    try {
        // 1.reading the token
        const token = req.header('Authorization');

        // 2. if no token 
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized: No token provided"});
        }
        
       

        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.userId = payload.id;
        req.userEmail = payload.email;

// Call next() only if the token is valid
        next();

    } catch (error) {
        if(error.name==="TokenExpiredError"){
           return res.status(401).json({success:false,message:"Session Ended"});
        }
        return res.status(401).json({success:false,message:"UnAuthorized"});
    }
    
}

export default Auth;