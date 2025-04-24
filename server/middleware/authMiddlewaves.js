const jwt=require("jsonwebtoken");
const User=require('../models/user');
const protectRoute=async(req,res,next)=>{
    try {
        let token=req.cookies?.token
        if(token){
            const decodeToken= jwt.verify(token,process.env.JWT_SECRET)
            const resp=await User.findById(decodeToken.userId).select("isAdmin email")
            
        
        req.user={
            email:resp.email,
            isAdmin:resp.isAdmin,
            userId:decodeToken.userId
        }
        next();
    }else{
        return res.status(401).json({status:false,message:"Not authorized.Try login again."})

    }
    } catch (error) {
        console.log(error)
        return res.status(401).json({status:false,message:"Not authorized.Try login again."})
    }
}
const isAdminRoute=(req,res,next)=>{
if(req.user && req.user.isAdmin){
    next();
}

else{
 return res.status(401).json({
    status:false,
    message:"Not authorized as admin. Try login as admin",
 });
}
}
module.exports={protectRoute,isAdminRoute};