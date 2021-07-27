const express = require('express');
const authController = require('../controllers/authController');
const isAuth = require('../middleware/isAuth');
const validation = require('../validations/userValidation');
const router = express.Router(); //mini app

router.post('/SignUp', validation.registerValidation, authController.SignUp);
router.put('/validate', authController.verifyEmail);
router.post('/joinUs', validation.logInValidation, authController.login);
router.put('/resetPassword', validation.getResetPass, authController.getResetPass);
router.put('/postNewPass/:token', validation.postResetPass, authController.postNewPass);

module.exports = router;