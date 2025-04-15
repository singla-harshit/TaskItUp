const mongoose=require("mongoose");
const dbConnection=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully")
    } catch (error) {
        console.log("Error in database connection",error)
    }
}
module.exports=dbConnection