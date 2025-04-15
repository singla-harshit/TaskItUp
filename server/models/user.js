const bcrypt=require("bcryptjs");
const {Schema, default: mongoose}=require("mongoose");
const userSchema=new Schema({
    name:{type:String ,required:true},
    title:{type:String,required:true},
    role:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
    tasks:[{type:Schema.Types.ObjectId,ref:"Task"}],
    isActive:{type:Boolean,required:true,default:true},
},{timestamps:true});
userSchema.pre("save",async(next)=>{
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
userSchema.method.matchPassword=async function(enteredPass){
    return await bcrypt.compare(enteredPass,this.password);
}
const user=mongoose.model("User",userSchema);
module.exports=user;