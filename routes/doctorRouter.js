const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const { getAllDoctorInfoContreller } = require("../controllers/AdminCtrl");
const {
  updateProfileController,
  getSingleDoctorByIdController,
  doctorAppointmentControoler,
  updateStatusController,
} = require("../controllers/doctorCtrl");
const router = express.Router();

//get single doctor Info
router.post("/getDoctorInfo", authMiddelware, getAllDoctorInfoContreller);

router.post("/updateProfile", authMiddelware, updateProfileController);
//post || get single doctor info
router.post("/getDoctorById", authMiddelware, getSingleDoctorByIdController);

//get ||appointments
router.get("/doctor-appointments", authMiddelware, doctorAppointmentControoler);


// post update status
router.post('/update-status',authMiddelware,updateStatusController)





module.exports = router;
