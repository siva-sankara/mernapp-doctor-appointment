const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const { getAllUsersContreller, getAllDoctorsContreller ,changeAccountStatusController} = require("../controllers/AdminCtrl");
const router = express.Router();

//get method || user
router.get("/getAllUsers", authMiddelware, getAllUsersContreller);

//get doctors || metyho
router.get('/getAllDoctors',authMiddelware,getAllDoctorsContreller);

//post || account status change 
router.post('/changeAccountStatus',authMiddelware ,changeAccountStatusController)







module.exports = router;
