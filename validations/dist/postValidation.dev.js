"use strict";

var _require = require('express-validator'),
    body = _require.body;

var postModel = require('../models/postModel'); // <<<<<<< HEAD
// // const { notify } = require('../routes/postRoutes');
// =======
// //const { notify } = require('../routes/postRoutes');
// >>>>>>> 65c430c5e1920ea53513ecb38fc813240aa25835
// const StartupName = body('StartupName')
// .exists().withMessage('please enter a title for your post')
// const description = body('description')
// .exists().withMessage('please enter a conent for your post');
// const CategoryId = body('categoryId')
// .exists().withMessage('please enter a categoryId for your post');


var Key = body('key').exists().withMessage('please enter a key for your post');
exports.createAndUpdatePost = []; // exports.filter = [CategoryId];

exports.search = [Key];