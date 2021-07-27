const {body} = require('express-validator');
const postModel = require('../models/commentModel');
//const { notify } = require('../routes/postRoutes');

const content = body('content')
.exists().withMessage('please enter your comment');

exports.Comment = [content];