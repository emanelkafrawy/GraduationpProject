"use strict";

var express = require('express');

var categoryController = require('../controllers/categoryController');

var validation = require('../validations/categoryValidation');

var isAuth = require('../middleware/isAuth');

var isAdmin = require('../middleware/isAdmin');

var router = express.Router();
router.get('/', isAuth, categoryController.getAllCategory); //get all category

router.get('/:categoryId', isAuth, isAdmin, categoryController.getCategory); //get single category

router.post('/', isAuth, validation.addCategoryValidation, categoryController.AddCategory); //create

router.put('/:categoryId', isAuth, isAdmin, validation.updateCategoryValidation, categoryController.updateCategory); //update

router["delete"]('/:categoryId', isAuth, isAdmin, categoryController.deleteCategory); //delete

module.exports = router;