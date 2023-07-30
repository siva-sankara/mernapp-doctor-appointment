const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const doctorModel = require("../models/doctorModel");
const appointmentModel = require('../models/AppointmentModel')
//register call back function
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if(existingUser) {
      return res
        .status(200)
        .send({ message: `user Already exists`, success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;
    const newUser = await userModel.create(req.body);
    res.status(201).send({ message: "Register successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ sucess: false, message: `register controller ${error.message}` });
  }
};

//login  call back
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "INVALID PASSWORD or EMAIL", success: false });
    }
    let payload = {
      id: user._id,
      email: user.email,
    };
    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("token", token)
      .send({ message: "Login Success", success: true, token });
    token: token;
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not Found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

//apply-doctor conreoller - middelware
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firtName} ${newDoctor.lastName} has Applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firtName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      sucess: false,
      message: "Error while applying for  doctor",
      error,
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      messsage: "all notiifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in Notification ",
      status: false,
      error,
    });
  }
};

const deleteAllNotificationController = async(req,res)=>{
  try {
    const user = await userModel.findOne({_id:req.body.userId})
    user.notification = []
    user.seenNotification = []
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      message:"Notifications Deleted succcessfully",
      status:true,
      data:updatedUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "unable to delete messages ",
      status: false,
      error,
    });
  }
}

const getAllDoctorsController =async(req,res)=>{
  try {
    const doctors =  await doctorModel.find({status:'Approved'})
    res.status(200).send({
      message:"Doctor list fetched successfully",
      success:true,
      data :doctors,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Fetching Doctor Data ",
      status: false,
      error,
    });
  }
}


const bookpAppointmentConntroller = async(req,res)=>{
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString()
    req.body.time = moment(req.body.time ,  "HH:mm").toISOString()
    req.body.status = "pending";
    const newAppointment  = new appointmentModel(req.body);
    await newAppointment.save()
    const user = await userModel.findOne({_id:req.body.userId})
    user.notification.push({
      type:"New-Appointment-request",
      message:`A new Appointment Request From ${req.body.userInfo.name} `,
      onclickPpath:'/user/appointments'
    });
    await user.save();
    res.status(200).send({
      success:true,
      data :user,
      message:"Appointment Bokk Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while bokking appointment ",
      status: false,
      error,
    });
  }
}


const bokkingAvailabilityController = async(req,res)=>{
  try {
    const date  = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.bosy.time, "HH:mm").subtract(1,"hours").toISOString()
    const toTime = moment(req.bosy.time, "HH:mm").subtract(1,"hours").toISOString()
    const doctorId =  req.bosy.doctorId;
    const appointment = await appointmentModel.find({doctorId,date, 
      time:{
        $gte:fromTime ,
        $lte:toTime,
      }
    })
    if(appointment.length > 0){
      return res.status(200).send({
        message:"Appointment not availabale at this time",
        success:true,
      })
    }
    else{
      return res.ststus(200).send({
        success:true,
        message :"Appointments available"
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in bokking  ",
      status: false,
      error,
    });
  }
}


const userApppointmentsController = async(req,res)=>{
 try {
    const appointments = await appointmentModel.find({
      userId:req.body.userId
    })
    res.status(200).send({
      message: " user Apoinntments fetched successfully ",
      success: true,
      data:appointments,
    });
 } catch (error) {
  console.log(error);
  res.status(500).send({
    message: "Error user Apoinntments ",
    status: false,
    error,
  });
 }
}

module.exports = {
  registerController,
  applyDoctorController,
  loginController,
  authController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookpAppointmentConntroller,
  bokkingAvailabilityController,
  userApppointmentsController,
};
