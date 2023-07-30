
const userModel = require('../models/userModel')
const doctorModel = require("../models/doctorModel");

const getAllUsersContreller =async(req,res)=>{
    try {
        const user = await userModel.find({})
        res.status(200).send({
            message:'user Data list',
            success:true,
            data:user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"error while fetchinf users",
            error
        })
    }
} 

const getAllDoctorsContreller =async(req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        res.status(200).send({
            message:'Doctor Data list',
            success:true,
            data:doctors,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while fetchinf Doctors data",
            error
        })
    }
} 

//doctor acoount status  
const changeAccountStatusController = async(req,res)=>{
    try {
        const {doctorId, status} = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId , {status})
        const user = await userModel.findOne({_id:doctor.userId})        
        const notification = user.notification
        notification.push({
            type:'doctor-account-request updated',
            message :`your Doctor Account Request has ${status}`,
            onclickPath : '/notification'
        })        
        user.isDoctor = status === 'approved ' ? true : false;
        await user.save()
        res.status(201).send({
            success:true,
            message:"Account Status Updated",
            data : doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error  in Account Status",
            error
        })
    }

}
const getAllDoctorInfoContreller =async (req,res)=>{
    try {
        console.log(req.body);
         const doctor = await doctorModel.findOne({userId: req.body.userId}) 
        res.status(200).send({
            message:'Doctor Data Info',
            success:true,
            data:doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while fetchinf DoctorsInfo ",
            error,
        })
    }
}

module.exports = { getAllUsersContreller ,getAllDoctorInfoContreller, getAllDoctorsContreller,changeAccountStatusController}