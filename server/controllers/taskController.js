const Task = require("../models/task")
const Notice = require("../models/notification")
// const UserActivation = require("../models/userActivation");
const User=require('../models/user')
const createTask = async (req, res) => {
    try {
        const { title, team, stage, date, priority } = req.body;
        const task = await Task.create({
            title,
            team,
            priority,
            stage: stage.toLowerCase(),
            date,
            
        })
        let text = "New task has been assigned to you"
        if (task.team.length > 1) {
            text = text + `and ${task.team.length - 1} others`
        }
        text = text + `The task priority is set a ${task.priority} priority ,so check and act accordingly. The task date is ${task.date.toDateString}.
        Thank you!!`
        await Notice.create({
            team, text, task: task._id
        })
        res.status(200).json({ status: true,task, message: "Task created successfully" })
    } catch (error) {
       console.log(error);

        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const duplicateTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id);
        console.log(task)
        const newTask = await Task.create({
            ...task,
            title: task.title + " - Duplicate"
        })
        // newTask.team = task.team;
        newTask.subTasks = task.subTasks;
        newTask.assets = task.assets;
        newTask.priority = task.priority;
        newTask.stage = task.stage;
        await newTask.save();
        //alert for user
        let text = "New task has been assigned to you"
        // if (task.team.length > 1) {
        //     text = text + `and ${task.team.length - 1} others`
        // }
        text = text + `The task priority is set a ${task.priority} priority ,so check and act accordingly. The task date is ${task.date.toDateString}.
           Thank you!!`
        await Notice.create({
             text, task: newTask._id
        })
        res.status(200).json({ status: true, message: "Duplicate Task created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const postTaskActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { type, activity } = req.body;
        const task = await Task.findById(id);
        const data = {
            type,
            activity,
            by: userId
        }
        task.activities.push(data)
        task.save();
        res.status(200).json({
            status: true,
            message: "Activity posted successfully"
        })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const dashboardStatistics = async (req, res) => {
    try {
        const { userId, isAdmin } = req.user;
        const allTasks = isAdmin ? await Task.find({ isTrashed: false })
            .populate({
                path: "team",
                select: "name role title email"
            }).sort({ _id: -1 })
            : await Task.find({ isTrashed: false, team: { $all: [userId] } })
                .populate({
                    path: "team",
                    select: "name role title email"
                }).sort({ _id: -1 });

        const users = await User.find({ isActive: true })
            .select("name title role isAdmin createdAt")
            .limit(10)
            .sort({ _id: -1 })

        const groupTasks = allTasks.reduce((result, task) => {
            const stage = task.stage;
            if (!result[stage]) {
                result[stage] = 1;
            }
            else {
                result[stage] += 1;

            }
            return result;
        }, {})
        //Group tasks by priority
        const groupData = Object.entries(
            allTasks.reduce((result, task) => {
                const { priority } = task;
                result[priority] = (result[priority] || 0) + 1;
                return result;
            }, {})).map(([name, total]) => ({ name, total }))
        //calculate total marks
        const totalTasks = allTasks?.length;
        const last10task = allTasks?.slice(0, 10)

        const summary = {
            totalTasks,
            last10task,
            users: isAdmin ? users : [],
            tasks: groupTasks,
            graphData: groupData
        }
        res.status(200).json({
            status: true, ...summary, message: "Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const getTasks = async (req, res) => {
    try {
      const { userId, isAdmin } = req.user || {};
      if (!userId && !isAdmin) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
      }
  
      const { stage, isTrashed, search } = req.query;
  
      let query = { isTrashed: isTrashed === "true" };
  
      if (!isAdmin) {
        query.team = { $all: [userId] };
      }
  
      if (stage) {
        query.stage = stage;
      }
  
      if (search && search.trim() !== "") {
        const searchQuery = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { stage: { $regex: search, $options: "i" } },
            { priority: { $regex: search, $options: "i" } },
          ],
        };
        query = { ...query, ...searchQuery };
      }
  
      const tasks = await Task.find(query)
        .populate({
          path: "team",
          select: "name title email",
        })
        .sort({ _id: -1 });
  
      res.status(200).json({
        status: true,
        tasks,
      });
    } catch (error) {
      console.error("Error in getTasks:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  };
  
const getTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id).populate({
            path: "team",
            select: "name title role email"
        }).populate({
            path: "activities.by",
            select: "name"
        }).sort({ _id: -1 });
        res.status(200).json({
            status: true,
            task
        })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const createSubTask = async (req, res) => {
    try {
        const { title, tag, date } = req.body;
        const { id } = req.params
        const newSubTask = {
            title,
            tag,
            date
        }
        const task = await Task.findById(id);
        task.subTasks.push(newSubTask)
        await task.save();
        res.status(200).json({ status: true, message: "Subtask added successfully" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const updateTask = async (req, res) => {
    try {
const {id}=req.params;
const {title,date,team,stage,priority,assets}=req.body;
const task=await Task.findById(id);
task.title=title;
task.date=date;
task.stage=stage.toLowerCase();
task.assets=assets;
task.priority=priority.toLowerCase();
task.team=team
await task.save();
res.status(200).json({status:true,message:"Task updated"})
    } catch (error) {
        console.log(error)

        return res.status(400).json({ status: false, message: "Invalid user data" })
    }
}
const trashTask=async(req,res)=>{
    try {
        const {id}=req.params;
        const task=await Task.findById(id);
        task.isTrashed=true;
        task.save();
        res.status(200).json({
            status:true,
            message:"Task trash successfully"
        })
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
  }
    }
    const deleteRestoreTask=async(req,res)=>{
    try {
        const {id}=req.params;
        const {actionType}=req.query;
        if(actionType==="delete"){
            await Task.findByIdAndDelete(id);
        }else if(actionType==="deleteAll"){
            await Task.deleteMany({isTrashed:true})
        }else if(actionType==="restore"){
            const resp=await Task.findByOne(id);
            resp.isTrashed=false;
            resp.save()
        }else if(actionType==="restoreAll"){
            await Task.updateMany({isTrashed:true},{$set:{isTrashed:false}})
        }
        res.status(200).json({
            status:true,
            message:"Operation performed successfully"
        })
    } catch (error) {
        return res.status(400).json({status:false,message:"Invalid user data" })
  }
    }
    // const deleteRestoreTask=async(req,res)=>{
    //     try {
    
    //     } catch (error) {
    //         return res.status(400).json({status:false,message:"Invalid user data" })
    //   }
    //     }
module.exports = { createTask, duplicateTask, postTaskActivity, dashboardStatistics, getTasks, getTask, createSubTask,updateTask,trashTask,deleteRestoreTask }   