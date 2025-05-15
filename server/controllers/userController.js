 const User=require('../models/user');
 const Notice=require("../models/notification")
const { createJWT } = require('../utils');
 const registerUser=async(req,res)=>{
    try {
        const {name,email,password,isAdmin,role,title}=req.body;
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists",status:false})
        }
        const user=await User.create({
            name,email,password,isAdmin,role,title
        })
        console.log(user);
        if(user){
            createJWT(res,user._id);
            user.password=undefined
            return res.status(201).json(user);
        }else{
            return res.status(400).json({status:false,message:"Invalid user data"})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401)
            .json({status:false,message:"Invalid email or password"})
        }
        if(!user?.isActive){
            return res.status(401).json({
                status:false,
                message:"User account has been deactivated ,contact the administrator"
            })
        }
        const isMatch=await user.matchPassword(password);
        if(user&&isMatch){
            createJWT(res,user._id)
            user.password=undefined
            res.status(200).json(user)
        }else{
            return res.status(401).json({status:false,message:"Invalid email or password"})
        }
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const logoutUser=async(req,res)=>{
    try {
        res.cookie("token","",{
            httpOnly:true,
            expires:new Date(0)
        })
        res.status(200).json({status:true,message:"Logout successfull"})
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const getTeamList=async(req,res)=>{
    try {
        const users=await User.find().select("name email role title isActive")
        res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const getNotificationList=async(req,res)=>{
    try {
        const {userId}=req.user;
        const notice=await Notice.find({
            team:userId,
            isRead:{$nin:[userId]},
        }).populate("task","title")
        res.status(201).json(notice)
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const updateUserProfile=async(req,res)=>{
    try {
        const {userId,isAdmin}=req.user;
        const {_id}=req.body;
        const id=isAdmin && userId===_id?userId:isAdmin&&userId!==_id?_id:userId;
        const user=await User.findById(id);
        if(user){
            user.name=req.body.name||user.name;
            user.title=req.body.title||user.title;
            user.role=req.body.role||user.role;
            const updatedUser=await user.save();
            user.password=undefined;
            res.status(201).json({
                status:true,
                message:"Profile Updated Successfully.",
                user:updatedUser
            })

        }else{
            res.status(400).json({status:false,message:"User not found"})
        }
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const markNotificationRead=async(req,res)=>{
    try {
        const {userId}=req.user;
        const {isReadType,id}=req.query;
        if(isReadType==="all"){
            await Notice.updateMany({team:userId,isRead:{$nin:[userId]}},
                {$push:{isRead:userId}},
                {new:true}
            )
        }
        else{
            await Notice.findOneAndUpdate({_id:id,isRead:{$nin:[userId]}},
                {$push:{isRead:userId}},
                {new:true}
            )
        }
        res.status(201).json({status:true,message:"Done"})
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const changeUserPassword=async(req,res)=>{
    try {
        const {userId}=req.user;
        const user=await User.findById(userId);
        if(user){
            user.password=req.body.password;
            await user.save();
            user.password=undefined;
            res.status(201).json({
                status:true,
                message:"Password changed successfully."
            })
        }
        else{
            res.status(404).json({
                status:false,
                message:"user not found"
            })
        }
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
    }
}
const activateUserProfile=async(req,res)=>{
try {
    const {id}=req.params;
    const user=await User.findById(id);
    if(user){
        user.isActive=req.body.isActive;
        console.log(req.body);
        await user.save();
        user.password=undefined;
        res.status(201).json({
            status:true,
            message:`User account has been ${user?.isActive?"Activated":"disabled"}`
        })
    }
    else{
        res.status(404).json({
            status:false,
            message:"user not found"
        })
    }
} catch (error) {
    return res.status(400).json({status:false,message:"Invalid user data" })
    
}
}
const deleteUserProfile=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findByIdAndDelete(id);
        res.status(200).json({
            status:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
        
    }
    }
module.exports={registerUser,loginUser,logoutUser,getTeamList,getNotificationList,updateUserProfile,markNotificationRead,changeUserPassword,deleteUserProfile,activateUserProfile}