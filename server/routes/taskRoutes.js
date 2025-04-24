const express=require("express");
const { protectRoute, isAdminRoute } = require("../middleware/authMiddlewaves");
const { createTask, duplicateTask, postTaskActivity, dashboardStatistics, getTasks, getTask, createSubTask, updateTask, trashTask, deleteRestoreTask } = require("../controllers/taskController");
const router=express.Router();
router.post('/create',protectRoute,isAdminRoute,createTask)
router.post('/duplicate/:id',protectRoute,isAdminRoute,duplicateTask)
router.post('/activity/:id',protectRoute,isAdminRoute,postTaskActivity)

router.get("/dashboard",protectRoute,dashboardStatistics);
router.get("/",protectRoute,getTasks);
router.get("/:id",protectRoute,getTask);

router.put("/create-subtask/:id",protectRoute,isAdminRoute,createSubTask);
router.put("/update/:id",protectRoute,isAdminRoute,updateTask);
router.put("/:id",protectRoute,isAdminRoute,trashTask);

router.delete("/delete-restore/:id",protectRoute,isAdminRoute,deleteRestoreTask)
module.exports=router