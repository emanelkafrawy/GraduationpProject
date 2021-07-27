const AboutUs = require('../models/aboutUsModel');
const {validationResult} = require('express-validator');

exports.getAllMails = async(req,res, next)=>{
    try{
        const AllMails = await AboutUs.find()
        if(!AllMails){
            return res.status(404).json({
                message: "no mail exist"
            });
        }
        return res.status(200).json({
            message: 'fetched all mails',
            mails: AllMails
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
}

exports.getContactMailInfo = async(req,res, next)=>{
    try{
        const mail = await AboutUs.findById(req.params.mailId);
        return res.status(200).json({
            message: 'mail info',
            mail: mail
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
}
exports.sendContactMail = async(req,res, next)=>{
    try{
        //validation
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const message = req.body.message;
        
        const mail = new AboutUs({
            name: name,
            email: email,
            phone: phone,
            message: message,
        })
        const result = await mail.save();
        return res.status(200).json({
            message: 'mail sent successfully..',
            mail: result
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
}

exports.deleteContactMail = async(req, res, next)=>{
    try{
        const mail = await AboutUs.findById(req.params.mailId)
        if (!mail) {
            return res.status(404).json({
                message: "mail not exist"
            });
        }
        const deleteMail = await AboutUs.findByIdAndRemove(req.params.mailId);
        return res.status(200).json({
            message: "delete successfully",
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        console.log(err)
        next(err);
    }
}
