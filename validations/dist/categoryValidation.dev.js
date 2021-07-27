"use strict";

var _require = require('express-validator'),
    body = _require.body;

var categoryModel = require('../models/categoryModel'); //const { notify } = require('../routes/categoryRoutes');


var Name = body('name').trim().exists().withMessage('enter a category name').isAlphanumeric().withMessage('name should be letters or / and characters only');
exports.addCategoryValidation = [Name];
exports.updateCategoryValidation = [Name];