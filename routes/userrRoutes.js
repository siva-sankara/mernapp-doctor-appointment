const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookpAppointmentConntroller,
  bokkingAvailabilityController,
  userApppointmentsController,
} = require("../controllers/userCtrl");
const authMiddelware = require("../middlewares/authMiddelware");

//router objectt
const router = express.Router();

//routes
//register|| post
router.post("/register", registerController);

//login || post
router.post("/login", loginController);

//Auth ||post
router.post("/getUserData", authMiddelware, authController);

//Apply-doctor ||post
router.post("/apply-doctor", authMiddelware, applyDoctorController);

//notification ||post
router.post(
  "/get-all-notification",
  authMiddelware,
  getAllNotificationController
);

//delete vnotificationsn
router.post(
  "/delete-all-notification",
  authMiddelware,
  deleteAllNotificationController
);

//get all doctors
router.get("/getAllDoctors", authMiddelware, getAllDoctorsController);
//book appointmet
router.post('/book-appointment',authMiddelware,bookpAppointmentConntroller)
//booking availability 
router.post('/booking-availability' ,authMiddelware,bokkingAvailabilityController )

// appolintment list 
router.get('/user-appointments',authMiddelware,userApppointmentsController)


module.exports = router;
