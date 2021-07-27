const {body} = require('express-validator');
const categoryModel = require('../models/categoryModel');
//const { notify } = require('../routes/categoryRoutes');

const Name = body('name').trim()
.exists().withMessage('enter a category name')
.isAlphanumeric().withMessage('name should be letters or / and characters only');


exports.addCategoryValidation = [Name];
exports.updateCategoryValidation = [Name];
