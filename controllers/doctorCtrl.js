const appointmentModel = require("../models/AppointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getAllDoctorInfoContreller = async (req, res) => {

  try {
    const doctor = await docterModel.findOne({ userrId: req.body.userId });
    res.status(200).send({
      message: "Data featch success",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in featching Doctor Details",
      success: false,
      error,
    });
  }
};

const updateProfileController = async(req, res) => {
  try {
    console.log("this is profiel updata" ,req.body);
    const data = await doctorModel.findOneAndUpdate({userId : req.body.userId},req.body,{new : true});
    console.log(data,"after update data");
    res.status(200).json({
      message: "successfully updated doctor profile",
      data: data,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error  in  update Doctor Details",
      success: false,
      error,
    });
  }
};

const getSingleDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      message: "single doctor Info is fetched ",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error  in geting single Doctor Details",
      success: false,
      error,
    });
  }
};

const doctorAppointmentControoler = async (req, res) => {
  try {
    const doctor = await doctorModel.find({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor.doctorId,
    });
    res.status(200).send({
      success: true,
      message: "Doctor appointment fetch successFully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error  in  Doctor appointments",
      success: false,
      error,
    });
  }
};
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "Status - Updated",
      message: `Your appointment has been updated${status} `,
      onclickPpath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      data: user,
      message: "status updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error  in  update status",
      success: false,
      error,
    });
  }
};

module.exports = {
  getAllDoctorInfoContreller,
  updateProfileController,
  getSingleDoctorByIdController,
  doctorAppointmentControoler,
  updateStatusController,
};
