const express=require("express");
const userRoutes=require("./userRoutes")
const taskRoutes=require("./taskRoutes")
const router=express.Router();
router.use("/user",userRoutes);// api/user
router.use("/task",taskRoutes);// api/task
module.exports=router;