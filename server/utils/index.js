const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const dbConnection=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully")
    } catch (error) {
        console.log("Error in database connection",error)
    }
}
const createJWT=async(res,userId)=>{
let token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"1d"});
res.cookie("token",token,{
httpOnly:true,
secure:process.env.NODE_ENV!=="development",
sameSite:"strict",//prevent csrf attacks
maxAge:1*24*60*60*1000,//one day
})
}
module.exports={dbConnection,createJWT}