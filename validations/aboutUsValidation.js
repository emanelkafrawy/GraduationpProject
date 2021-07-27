const {body} = require('express-validator');
const aboutUsModel = require('../models/aboutUsModel');
//const { notify } = require('../routes/aboutUsRoutes');


const name = body('name')

const email = body('email')
.exists().withMessage('enter email')
.isEmail().withMessage('please enter a valid email')
.normalizeEmail();


const phone = body('phone')
.exists().withMessage('enter email')
.isMobilePhone().withMessage('please enter a valid phone number');

const message = body('message')
.exists().withMessage('please enter your message');

exports.sendContactmail = [name,email,phone,message];
