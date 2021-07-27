const Job = require("../models/jobModel")
const User = require("../models/userModel")
const bcrypt = require('bcryptjs');
const mail = require('../sendEmail');


const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

exports.createJob = async (req, res, nxt) =>{
    try{
        const user = await User.findById(req.userId)
        console.log(user);
        if(!user){
            res.status(500).json({
                message: 'User not found',
            })
        }
        const creator = req.userId;
        const JobName = req.body.JobName;
        const JobDescription = req.body.JobDescription;
        const phone = req.body.phone;
        const Salary = req.body.Salary;
        const addressLine = req.body.addressLine;
        const websitelink = req.body.websitelink;
        const facebookpage = req.body.facebookpage;
        const job = new Job ({
            JobName,JobDescription,phone, Salary, addressLine, websitelink,facebookpage, creator
        })
        const jobnew = await job.save();
        res.status(200).json({
            "message": "job is added successfully"
        });
        
    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        nxt(err);
    }
}
exports.getAllJob = async(req, res, next) =>{
    try{
        const user = await User.findById(req.userId)
        console.log(user);
        
        if(!user){
            res.status(500).json({
                message: 'User not found',
            })
        }
        const allJobs = await Job.find()
        .populate("creator")
        res.status(200).json({
            message: "data catched sucessfully ",
            alljob: allJobs
        })
        
        transporter.sendMail(opts, (err, info) => {
            if(err) {
                console.log('ERROR MAILING! ' + err);
            } else {
                console.log('Email is sent to ' + email);
            }
        });

    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
}

exports.applyJob = async(req, res, next) =>{
    try{
        const user = await User.findById(req.userId)
        console.log(user);
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId)
            .populate("creator")
        // const pass ;
        console.log(job.creator.email);
        let html = `
        <h1> Hello ${job.creator.firstName} </h1>
        <p>hi my name is ${user.firstName} i want to apply this job please and my email is ${user.email} please contact me if you are interested</p>
        `;
        mail.sendEmail(job.creator.email, job.JobName, html);
        if(!user){
            res.status(500).json({
                message: 'User not found',
            })
        }
        res.status(200).json({
            message: "get job success",
        })

    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
}