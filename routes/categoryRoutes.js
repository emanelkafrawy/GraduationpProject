const express = require('express');

const categoryController = require('../controllers/categoryController');
const validation = require('../validations/categoryValidation');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router(); 

router.get('/:name', isAuth, categoryController.AddCategory); //create

router.get('/', isAuth,  categoryController.getAllCategory); //get all category

router.get('/:categoryId', isAuth, isAdmin, categoryController.getCategory); //get single category


router.put('/:categoryId', isAuth, isAdmin, validation.updateCategoryValidation, categoryController.updateCategory); //update

router.delete('/:categoryId', isAuth, categoryController.deleteCategory); //delete

module.exports = router;