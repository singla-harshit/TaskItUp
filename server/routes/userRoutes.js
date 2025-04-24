const express=require("express");
const router=express.Router();
const {isAdminRoute,protectRoute}=require("../middleware/authMiddlewaves");
const { registerUser, loginUser, logoutUser, getTeamList, getNotificationList, updateUserProfile, markNotificationRead, changeUserPassword, activateUserProfile, deleteUserProfile } = require("../controllers/userController");
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);

router.get('/get-team',protectRoute,isAdminRoute,getTeamList);
router.get('/notifications',protectRoute,getNotificationList);

router.put('/profile',protectRoute,updateUserProfile);
router.put('/read-noti',protectRoute,markNotificationRead);
router.put('/change-password',protectRoute,changeUserPassword);
// //For admin-only
router
.route('/:id')
.put(protectRoute,isAdminRoute,activateUserProfile)
.delete(protectRoute,isAdminRoute,deleteUserProfile);
module.exports=router