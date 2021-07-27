const {body} = require('express-validator');
const userModel = require('../models/userModel');
//const { notify } = require('../routes/authRoutes');

const firstName = body('firstName').trim()
.exists().withMessage('enter your first name')
.isAlphanumeric().withMessage('firstName should be letters or / and characters only');

const lastName = body('lastName').trim()
.exists().withMessage('enter your last name')
.isAlphanumeric().withMessage('lastName should be letters or / and characters only');

const name2 = body('name').trim()
.not().isEmpty().withMessage("please enter name")
.isAlphanumeric().withMessage('Name should be letters or / and characters only');

const email = body('email')
.exists().withMessage('enter email')
.isEmail().withMessage('please enter a valid email')
.custom((value, {req}) => {
    return userModel.findOne({email: value})
    .then(mail => {
        if (mail) {
            return Promise.reject('this Email already exist!');
        }
    })
}).normalizeEmail();

const password = body('password')
.exists().withMessage('enter pass')
.isLength({min: 8}).withMessage('the password is required with minimum length 8 characters')
.withMessage('please enter at least one lowercase & one uppercase letter & one number with minimum length 8');

const oldPass = body('oldPassword')
.exists().withMessage('enter pass')
.isLength({min: 8}).withMessage('the password is required with minimum length 8 characters')
.withMessage('please enter at least one lowercase & one uppercase letter & one number with minimum length 8');

const newPass = body('newPassword')
.exists().withMessage('enter pass')
.isLength({min: 8}).withMessage('the password is required with minimum length 8 characters')
.withMessage('please enter at least one lowercase & one uppercase letter & one number with minimum length 8');

const email2 = body('email')
.isEmail().withMessage('please enter a valid email')
.normalizeEmail()
.exists().withMessage('enter email');

const confirmPass = body('confirm').trim()
.isLength({min: 8}).withMessage('the password is required with minimum length 8 characters')
.exists().withMessage('enter confirmation pass');

const confirmPass2 = body('confirmPassword').trim()
.isLength({min: 8}).withMessage('the password is required with minimum length 8 characters')
.exists().withMessage('enter confirmation pass');
//ll update 

const bio = body('bio').optional({nullable:true})
.isLength({min: 20}).withMessage('the minimum length of bio is 20 characters');

const summary = body('summary').optional({nullable:true})
.isLength({min: 30}).withMessage('the minimum length of summary is 30 characters');

const fb=body('facebook').trim().optional({nullable:true}).isURL().withMessage('please enter a valid URL');
const linkedIn=body('linkedIn').trim().optional({nullable:true}).isURL().withMessage('please enter a valid URL');
const gitHub=body('gitHub').trim().optional({nullable:true}).isURL().withMessage('please enter a valid URL');


exports.registerValidation = [firstName, lastName, email, password];
exports.logInValidation = [email2, password];
exports.getResetPass = [email2];
exports.postResetPass = [password, confirmPass];
exports.makeAdmin = [email2];
exports.changePass = [oldPass, newPass, confirmPass2];
exports.filter = [name2];