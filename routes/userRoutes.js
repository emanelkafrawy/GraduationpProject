const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');
const validation = require('../validations/userValidation');
const uploads = require('../middleware/fileUpload');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router(); //mini app

router.get('/admins', isAuth, userController.getAllAdmins);

router.put('/updateProfile', isAuth, userController.updateProfile);
router.get('/getUsers', isAuth, userController.getAllUsers); //for admin only
router.get('/filter', isAuth,validation.filter , userController.filter); //x validation hena x l input
router.get('/', isAuth, userController.myProfile);//l profile bta3i ana 
router.get('/:userId', isAuth, userController.getUser); //profile user mo3yn
router.delete('/blockUser/:userId', isAuth, isAdmin, userController.blockUser);
router.get('/makeAdmin/:userId', isAuth, userController.makeAdmin);
router.put('/changePass', isAuth, validation.changePass ,userController.changePass);
//avatar
router.post('/avatar', isAuth, uploads.single('pic'),
userController.createAvatar, (err, req, res, nxt) => { //l rab3a de to handle error
    res.status(400).send({
        error: err.message
    });
});
router.delete('/avatar', isAuth, userController.deleteAvatar);
module.exports = router;