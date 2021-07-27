const express = require('express');
const commentController = require('../controllers/commentController');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const validation = require('../validations/commentValidation');

router.post('/',validation.Comment, isAuth ,commentController.createComment);
router.get('/', isAuth, commentController.getAllComments);
router.get('/:commentId', isAuth, commentController.getSingleComment);
router.put('/:commentId', isAuth, commentController.updateComment);
router.delete('/:commentId', isAuth, commentController.deleteOne);
router.delete('/', isAuth, commentController.deleteAllComment);
//favourite


module.exports = router;
