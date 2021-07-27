const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const {validationResult} = require('express-validator');
const Posts = require('../models/postModel')
const Users = require('../models/userModel')
exports.getAllCategory = async(req, res, next) => {
    try{
        const categories = await Category.find().select('name')
        .populate('adminId', 'firstName lastName')
        res.status(200).json({
            // message: 'Fetched all data successfully',
            categories
        })
    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getCategory = async(req, res, next) => {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId)
        .populate('adminId', 'firstName lastName')
    try{
        if(!category) {
            const error = new Error("Couldn't found category.");
            error.statusCode = 404;
            throw error; 
        }
        if(category.adminId._id.toString() !== req.userId) {
            const error = new Error('NOT authorized.');
            error.statusCode = 403;
            throw error;   
        }
        const user = await User.findById(category.adminId)
        res.status(200).json({
            message: 'category fetched',
            category: category
        });
    }catch(err){
        if(!err.statusCode) {
            err.statusCode = 500 
        }
        next(err)
    };
}

exports.AddCategory = async(req, res, next) => {

    //validation
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    try{
        const user = await User.findById(req.userId)
        if(!user){
            res.status(200).json({
                message: 'not authorized',
            })
        }
        const name = req.params.name;
        // console.log('ddddd' + name);
        const category = new Category({
            name: name,
            adminId: req.userId    
        });
        await category.save()
        res.status(200).json({
            message: 'Category created successfully',
            category: category,
            admin: {_id: user._id, firstName: user.firstName, lastName: user.lastName}
        })
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateCategory = async (req, res, next) => {

    //validation
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    
    const categoryId = req.params.categoryId;
    const name = req.body.name;
    try {
        const category = await Category.findById(categoryId)
            .populate('adminId', 'firstName lastName');
        if(!category) {
            const error = new Error('Category not found ');
            error.statusCode = 404;
            next(error);
        }
        if(category.adminId._id.toString() !== req.userId) {
            const error = new Error('NOT authorized.');
            error.statusCode = 403;
            throw error;   
        }

        category.name = name;
        // category.adminId = adminId;
        
        const result = await category.save();
        res.status(200).json({
            message: 'Category updated successfully',
            category: result
        })
    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteCategory = async(req, res, next) => {
    const categoryId = req.params.categoryId;
    try{
        const category = await Category.findById(categoryId)
        .populate('adminId', 'firstName lastName')

        const findPost = await Posts.find({categoryId: categoryId});
        const user = await Users.find({posts: {$in: findPost}});
        if(findPost && user[0]){
            // console.log(user[0]);
            user.forEach(u=>
            u.posts.pull(findPost[0]._id))
        }
        const posts = await  Posts.deleteMany({categoryId: categoryId});
        if(!category) {
            const error = new Error('Category not found ');
            error.statusCode = 404;
            next(error);
        }
        // if(category.adminId._id.toString() !== req.userId) {
        //     const error = new Error('NOT authorized.');
        //     error.statusCode = 403;
        //     throw error;   
        // }
        await Category.findByIdAndRemove(categoryId);
        res.status(200).json({
            message: 'Deleted successfully'
        })       
    }
    catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};