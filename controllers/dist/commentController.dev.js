"use strict";

var commentModel = require('../models/commentModel');

var postModel = require('../models/postModel');

var userModel = require('../models/userModel');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var itemsPerPage = 6;

exports.createComment = function _callee(req, res, nxt) {
  var errors, content, userId, postId, post, comment, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context.sent;

          if (errors.isEmpty()) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          content = req.body.content;
          userId = req.userId;
          postId = req.baseUrl.split('/')[2];
          _context.next = 11;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }));

        case 11:
          post = _context.sent;

          if (post) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            "message": "post not found"
          }));

        case 14:
          //add to comment schema
          comment = new commentModel({
            content: content,
            userId: userId,
            postId: postId
          });
          _context.next = 17;
          return regeneratorRuntime.awrap(comment.save());

        case 17:
          //push to post
          post.comments.push(comment._id);
          _context.next = 20;
          return regeneratorRuntime.awrap(post.save());

        case 20:
          _context.next = 22;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 22:
          user = _context.sent;

          if (user) {
            _context.next = 25;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            "message": "user not found"
          }));

        case 25:
          user.comments.push(comment._id);
          _context.next = 28;
          return regeneratorRuntime.awrap(user.save());

        case 28:
          return _context.abrupt("return", res.status(201).json({
            "message": "comment is added successfully"
          }));

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);

          if (!_context.t0.statusCode) {
            _context.t0.statusCode = 500;
          }

          nxt(_context.t0);

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

exports.getAllComments = function _callee2(req, res, nxt) {
  var postId, page, post;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          postId = req.baseUrl.split('/')[2];
          page = req.query.page ? parseInt(req.query.page) : 1; //for pagination

          _context2.next = 5;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }).populate('categoryId', {
            name: 1
          }).populate({
            path: 'comments',
            select: 'content',
            populate: {
              path: 'userId',
              model: 'User',
              select: 'firstName lastName pic'
            }
          }).sort({
            createdAt: -1
          }).skip((page - 1) * itemsPerPage).limit(itemsPerPage));

        case 5:
          post = _context2.sent;
          ;

          if (post) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            "message": "post not found"
          }));

        case 9:
          return _context2.abrupt("return", res.status(200).json({
            message: "comments are fetched successfully",
            comment_Num: post.comments.length,
            comments: post.comments.length > 0 ? post.comments : "No Comments on this post"
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);

          if (!_context2.t0.statusCode) {
            _context2.t0.statusCode = 500;
          }

          nxt(_context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.getSingleComment = function _callee3(req, res, nxt) {
  var postId, commentId, post;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          postId = req.baseUrl.split('/')[2];
          commentId = req.originalUrl.split('/')[4];
          _context3.next = 5;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }).populate('categoryId', {
            name: 1
          }).populate({
            path: 'comments',
            select: 'content',
            populate: {
              path: 'userId',
              model: 'User',
              select: 'firstName lastName pic'
            }
          }).exec());

        case 5:
          post = _context3.sent;

          if (post) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            "message": "post not found"
          }));

        case 8:
          if (post.comments.id(commentId)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            "message": "post not found"
          }));

        case 10:
          return _context3.abrupt("return", res.status(200).json({
            message: "comment is fetched successfully",
            comment: post.comments.id(commentId)
          }));

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);

          if (!_context3.t0.statusCode) {
            _context3.t0.statusCode = 500;
          }

          nxt(_context3.t0);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.updateComment = function _callee4(req, res, nxt) {
  var postId, commentId, post, comment, updatedPost;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          postId = req.baseUrl.split('/')[2];
          commentId = req.originalUrl.split('/')[4];
          _context4.next = 5;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }).populate('categoryId', {
            name: 1
          }).populate({
            path: 'comments',
            select: 'content',
            populate: {
              path: 'userId',
              model: 'User',
              select: 'firstName lastName pic'
            }
          }).exec());

        case 5:
          post = _context4.sent;

          if (post) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            "message": "post not found"
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(commentModel.findById(commentId));

        case 10:
          comment = _context4.sent;

          if (comment) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            "message": "comment not found"
          }));

        case 13:
          if (!(comment.userId.toString() !== req.userId.toString())) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            message: "you're not authorized to update this comment"
          }));

        case 15:
          //override
          comment.content = req.body.content;
          _context4.next = 18;
          return regeneratorRuntime.awrap(comment.save());

        case 18:
          _context4.next = 20;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }).populate('categoryId', {
            name: 1
          }).populate({
            path: 'comments',
            select: 'content',
            populate: {
              path: 'userId',
              model: 'User',
              select: 'firstName lastName pic'
            }
          }).exec());

        case 20:
          updatedPost = _context4.sent;
          return _context4.abrupt("return", res.status(200).json({
            message: "comment is updated successfully",
            post: updatedPost
          }));

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](0);

          if (!_context4.t0.statusCode) {
            _context4.t0.statusCode = 500;
          }

          nxt(_context4.t0);

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

exports.deleteOne = function _callee5(req, res, nxt) {
  var postId, commentId, post, comment, deletdComment, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          postId = req.baseUrl.split('/')[2];
          commentId = req.originalUrl.split('/')[4];
          _context5.next = 5;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }).populate('categoryId', {
            name: 1
          }).populate({
            path: 'comments',
            select: 'content',
            populate: {
              path: 'userId',
              model: 'User',
              select: 'firstName lastName pic'
            }
          }));

        case 5:
          post = _context5.sent;

          if (post) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            "message": "post not found"
          }));

        case 8:
          _context5.next = 10;
          return regeneratorRuntime.awrap(commentModel.findById(commentId));

        case 10:
          comment = _context5.sent;

          if (comment) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            "message": "comment not found"
          }));

        case 13:
          if (!(comment.userId.toString() !== req.userId.toString() || post.createdBy.toString() === req.userId.toString())) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", res.status(401).json({
            message: "you're not authorized to delete this comment"
          }));

        case 15:
          _context5.next = 17;
          return regeneratorRuntime.awrap(commentModel.findByIdAndRemove(commentId));

        case 17:
          deletdComment = _context5.sent;
          //delete from array of posts
          post.comments.pull(commentId);
          _context5.next = 21;
          return regeneratorRuntime.awrap(post.save());

        case 21:
          _context5.next = 23;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 23:
          user = _context5.sent;

          if (user) {
            _context5.next = 26;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            "message": "user not found"
          }));

        case 26:
          _context5.next = 28;
          return regeneratorRuntime.awrap(user.comments.pull(commentId));

        case 28:
          _context5.next = 30;
          return regeneratorRuntime.awrap(user.save());

        case 30:
          return _context5.abrupt("return", res.status(200).json({
            message: "comment is deleted successfully",
            post: deletdComment
          }));

        case 33:
          _context5.prev = 33;
          _context5.t0 = _context5["catch"](0);

          if (!_context5.t0.statusCode) {
            _context5.t0.statusCode = 500;
          }

          nxt(_context5.t0);

        case 37:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

exports.deleteAllComment = function _callee6(req, res, nxt) {
  var postId, post, comments, deletdComment, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          postId = req.baseUrl.split('/')[2];
          _context6.next = 4;
          return regeneratorRuntime.awrap(postModel.findOne({
            _id: postId,
            approved: true
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1,
            pic: 1
          }).populate('categoryId', {
            name: 1
          }).populate({
            path: 'comments',
            select: 'content',
            populate: {
              path: 'userId',
              model: 'User',
              select: 'firstName lastName pic'
            }
          }));

        case 4:
          post = _context6.sent;

          if (post) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            "message": "post not found"
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(commentModel.find({
            postId: postId
          }));

        case 9:
          comments = _context6.sent;

          if (comments) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            "message": "there are no comments on this post"
          }));

        case 12:
          if (!(post.createdBy.toString() === req.userId.toString())) {
            _context6.next = 14;
            break;
          }

          return _context6.abrupt("return", res.status(401).json({
            message: "you're not authorized to delete these comments"
          }));

        case 14:
          _context6.next = 16;
          return regeneratorRuntime.awrap(commentModel.deleteMany({
            postId: postId
          }));

        case 16:
          deletdComment = _context6.sent;
          _context6.next = 19;
          return regeneratorRuntime.awrap(post.comments.splice(0, post.comments.length));

        case 19:
          _context6.next = 21;
          return regeneratorRuntime.awrap(post.save());

        case 21:
          _context6.next = 23;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 23:
          user = _context6.sent;

          if (user) {
            _context6.next = 26;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            "message": "user not found"
          }));

        case 26:
          _context6.next = 28;
          return regeneratorRuntime.awrap(user.comments.splice(0, post.comments.length));

        case 28:
          _context6.next = 30;
          return regeneratorRuntime.awrap(user.save());

        case 30:
          return _context6.abrupt("return", res.status(200).json({
            message: "comments are deleted successfully",
            post: post
          }));

        case 33:
          _context6.prev = 33;
          _context6.t0 = _context6["catch"](0);

          if (!_context6.t0.statusCode) {
            _context6.t0.statusCode = 500;
          }

          nxt(_context6.t0);

        case 37:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 33]]);
}; //add to Favourite

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