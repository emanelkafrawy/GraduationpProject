const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');
const itemsPerPage = 6; 
exports.createComment = async (req, res, nxt) => {
    try{
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        const content = req.body.content;
        const userId = req.userId;
        const postId = req.baseUrl.split('/')[2];
        const post = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1});
        if (!post) {
            return res.status(401).json({
                "message": "post not found"
            });
        }
        //add to comment schema
        const comment = new commentModel({
            content,
            userId,
            postId
        });
        await comment.save();
        //push to post
        post.comments.push(comment._id);
        await post.save();
        //add to user
        const user = await userModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                "message": "user not found"
            })
        }
        user.comments.push(comment._id);
        await user.save()
        return res.status(201).json({
            "message": "comment is added successfully"
        });
    }catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
    
    //const postId = req.baseUrl.split('/')[2];
    // console.log(postId);
    // postModel.findById(postId)
    // .then(post => {
    //         if(!post || !post.approved) {
    //             const err = new Error('could not find post');
    //             err.status = 404;
    //             throw err;
    //         }
    //         post.comments.push(req.body);
    //         return post.save()
    // })
    // .then(postt => {
    //     return postModel.findById(postt._id)
    //     .populate('comments.userId')
    // })
    // .then(posttt => {
    //     res.status(201).json({
    //         message: "comment is added successfully",
    //         post: posttt
    //     })
    // })
    // .catch(err => {
    //     if(!err.statusCode) {
    //         err.statusCode = 500
    //     }
    //     nxt(err);
    // });
};

exports.getAllComments = async (req, res, nxt) => {
    try {
        const postId = req.baseUrl.split('/')[2];
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        const post = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        })
        .sort({createdAt: -1})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);;
        if (!post) {
            return res.status(401).json({
                "message": "post not found"
            });
        }
        return res.status(200).json({
            message: "comments are fetched successfully",
            comment_Num : post.comments.length,
            comments: post.comments.length>0 ? post.comments : "No Comments on this post"
        });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt (err);
    }
};

exports.getSingleComment = async (req, res, nxt) => {
    try {
        const postId = req.baseUrl.split('/')[2];
        const commentId = req.originalUrl.split('/')[4];
        const post = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        }).exec()
        if (!post) {
            return res.status(404).json({
                "message": "post not found"
            });
        }
        if(!post.comments.id(commentId)) {
            return res.status(404).json({
                "message": "post not found"
            });
        }
        return res.status(200).json({
            message: "comment is fetched successfully",
            comment: post.comments.id(commentId)
        });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt (err);
    }
};

exports.updateComment = async (req, res, nxt) => {
    try {
        const postId = req.baseUrl.split('/')[2];
        const commentId = req.originalUrl.split('/')[4];
        const post = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        }).exec()
        if (!post) {
            return res.status(404).json({
                "message": "post not found"
            });
        }
        const comment = await commentModel.findById(commentId)
        if(!comment) {
            return res.status(404).json({
                "message": "comment not found"
            });
        }
        //check if owner comment or not
        if (comment.userId.toString() !== req.userId.toString()) {
            return res.status(401).json({
                message: "you're not authorized to update this comment"
            });
        }
        //override
        comment.content = req.body.content;
        await comment.save();
        //post after updated comment
        const updatedPost = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        }).exec()
        return res.status(200).json({
            message: "comment is updated successfully",
            post: updatedPost
        });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt (err);
    }
};

exports.deleteOne = async (req, res, nxt) => {
    try {
        const postId = req.baseUrl.split('/')[2];
        const commentId = req.originalUrl.split('/')[4];
        const post = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        })
        if (!post) {
            return res.status(404).json({
                "message": "post not found"
            });
        }
        const comment = await commentModel.findById(commentId)
        if(!comment) {
            return res.status(404).json({
                "message": "comment not found"
            });
        }
        //check if is owner comment or not
        if (comment.userId.toString() !== req.userId.toString() ||
        post.createdBy.toString() === req.userId.toString()) {
            return res.status(401).json({
                message: "you're not authorized to delete this comment"
            });
        }
        //delete from comment schema
        const deletdComment = await commentModel.findByIdAndRemove(commentId);
        //delete from array of posts
        post.comments.pull(commentId);
        await post.save();
        //delete from array of users
        const user = await userModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                "message": "user not found"
            });
        }
        await user.comments.pull(commentId);
        await user.save();
        return res.status(200).json({
            message: "comment is deleted successfully",
            post: deletdComment
        });

    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt (err);
    }
};

exports.deleteAllComment = async (req, res, nxt) => {
    try {
        const postId = req.baseUrl.split('/')[2];
        const post = await postModel.findOne({_id: postId, approved: true})
        .populate('createdBy', {firstName: 1, lastName: 1, pic: 1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        })
        if (!post) {
            return res.status(404).json({
                "message": "post not found"
            });
        }
        const comments = await commentModel.find({postId: postId})
        if(!comments) {
            return res.status(404).json({
                "message": "there are no comments on this post"
            });
        }
        //check if is owner comment or not
        if ( post.createdBy.toString() === req.userId.toString()) {
            return res.status(401).json({
                message: "you're not authorized to delete these comments"
            });
        }
        //delete all comments from comment schema
        const deletdComment = await commentModel.deleteMany({postId: postId});
        //delete comment from array of posts
        await post.comments.splice(0, post.comments.length);
        await post.save();
        //delete comment from array of users
        const user = await userModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                "message": "user not found"
            });
        }
        await user.comments.splice(0, post.comments.length);
        await user.save();
        return res.status(200).json({
            message: "comments are deleted successfully",
            post: post
        });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt (err);
    }
};

//add to Favourite
/*exports.addToFav = (req, res, nxt) => {
    const postId = req.baseUrl.split('/')[3];
    const userId = req.body.userId;
    let fav;
    //search about post
    postModel.findById(postId)
    .then(post => {
        if(!post || !post.approved) {
            const err = new Error('could not find post');
            err.statusCode = 404;
            throw err;
        }
        //search if user has favourite or not
        return favouriteModel.find({userId: userId}) 
    })
    .then(favourite => {
        fav = favourite; //ht7agha x l json
        if (favourite.length != 0) { //user has favourite
            if (favourite[0].postId.includes(postId)) { //check if post exist or not
                const err = new Error('this post is already in your favourite');
                err.statusCode = 500;
                throw err;
            } else { //post not exist
                fav[0].postId.push(postId);
                fav[0].save();
                return false; //to stop bottom code
            }
        }  
         //user not have favourite then create one
            const newFavourite = new favouriteModel({
                userId: userId,
                postId: postId
            });
            newFavourite.save()
    })
    .then(result => {
        res.status(201).json({
            message: "added to your favourite successfully",
            // favourite: result
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    })
}
*/
//remove from favourite
/*exports.removeFromFavourite = (req, res, nxt) => {
    const favId = req.params.favId;
    const postId = req.baseUrl.split("/")[3];
    const userId = req.body.userId;
    var flag = false;
    // favouriteModel.findById(favId)
    favouriteModel.find({userId: userId})
    .populate('postId')
    .then(fav => {
        if(fav.length == 0) {
            const err = new Error('could not find favourite');
            err.statusCode = 404;
            throw err;
        } 
        fav[0].postId.forEach(element => {
            if (element._id.toString() === postId.toString()) {
                flag = true
            }
        });
        //check authorization
        // if(fav[0].userId.toString() !== userId.toString()) {
        //     const err = new Error("you're not authorized to perform this operation");
        //     err.statusCode = 401;
        //     throw err;
        // }
        //check if fav contains on the post
        if(!flag) {
            const err = new Error('post is not in your favourite');
            err.statusCode = 404;
            throw err;
        }
        //delete
        fav[0].postId.pull(postId);
        return fav[0].save();
    })
    .then(result => {
        res.status(200).json({
            message: "you deleted post from your favourite",
            favourite: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        nxt(err);
    })
};*/