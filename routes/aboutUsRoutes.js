const express = require('express');
const aboutUsController = require('../controllers/aboutUsController');
const validation = require('../validations/aboutUsValidation');
const router = express.Router();


router.get('/', aboutUsController.getAllMails);

router.get('/:mailId', aboutUsController.getContactMailInfo);

router.post('/',validation.sendContactmail, aboutUsController.sendContactMail);

router.delete('/:mailId', aboutUsController.deleteContactMail);

module.exports = router;
//,validation.sendContactmail