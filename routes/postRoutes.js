const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const validation = require('../validations/postValidation');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const uploads = require('../middleware/fileUpload');


const router = express.Router();
router.post('/', isAuth, uploads.array('pic', 50), validation.createAndUpdatePost,
postController.createPost, (err, req, res, nxt) => { //l rab3a de to handle error
    res.status(400).send({
        error: err.message
    });
});//by title, content , categoryId,pic
router.get('/counter', isAuth, postController.conuterPosts);

router.get('/search', isAuth, postController.search);//by key
router.get('/filter', isAuth, postController.filter);//by categoryId
router.get('/approve', isAuth,  postController.getAllUnapprovedPost); //for admin
router.get('/:postId', isAuth, postController.findPost);
router.get('/', isAuth, postController.getAllPost);
router.put('/:postId', isAuth, uploads.array('pic', 50), validation.createAndUpdatePost,
postController.updatePost, (err, req, res, nxt) => { //l rab3a de to handle error
    res.status(400).send({
        error: err.message
    });
});//same as create 
router.delete('/:postId', isAuth, postController.deletePost);

//admin
router.get('/approve/:postId', isAuth, postController.approvPost); //for  
router.delete('/approve/:postId', isAuth,postController.refusePost);


module.exports = router 