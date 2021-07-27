const express = require('express');
const jobController = require('../controllers/jobController');
// const validation = require('../validations/aboutUsValidation');
const isAuth = require('../middleware/isAuth');

const router = express.Router();


router.get('/',isAuth, jobController.getAllJob);

router.post('/',isAuth, jobController.createJob);
router.get('/:jobId/apply',isAuth, jobController.applyJob);

module.exports = router;
//,validation.sendContactmail