"use strict";

var express = require('express');

var multer = require('multer');

var userController = require('../controllers/userController');

var isAuth = require('../middleware/isAuth');

var validation = require('../validations/userValidation');

var uploads = require('../middleware/fileUpload');

var isAdmin = require('../middleware/isAdmin');

var router = express.Router(); //mini app

router.put('/updateProfile', isAuth, userController.updateProfile);
router.get('/getUsers', isAuth, userController.getAllUsers); //for admin only

router.get('/filter', isAuth, validation.filter, userController.filter); //x validation hena x l input

router.get('/', isAuth, userController.myProfile); //l profile bta3i ana 

router.get('/:userId', isAuth, userController.getUser); //profile user mo3yn

router["delete"]('/blockUser/:userId', isAuth, isAdmin, userController.blockUser);
router.put('/makeAdmin', isAuth, isAdmin, validation.makeAdmin, userController.makeAdmin);
router.put('/changePass', isAuth, validation.changePass, userController.changePass); //avatar

router.post('/avatar', isAuth, uploads.single('pic'), userController.createAvatar, function (err, req, res, nxt) {
  //l rab3a de to handle error
  res.status(400).send({
    error: err.message
  });
});
router["delete"]('/avatar', isAuth, userController.deleteAvatar);
module.exports = router;