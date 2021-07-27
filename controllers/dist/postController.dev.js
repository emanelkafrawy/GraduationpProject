"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var wordNetAPI = require('node-wordnet');

var data = require('../data');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var postModel = require('../models/postModel');

var userModel = require('../models/userModel');

var commentModel = require('../models/commentModel');

var itemsPerPage = 6;

exports.getAllPost = function _callee(req, res, nxt) {
  var condition, mappedArr, user, page, posts;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 3:
          user = _context.sent;
          // const userInterests = user.interests;
          page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
          //checkif user has interests or not 
          // if(userInterests.length <= 0) {
          //     condition = {approved: true}
          // } else {
          //     //regulare expression
          //     mappedArr = [...userInterests.map(el => {
          //         return new RegExp(el, "i");
          //     })]
          //     condition = {$and:[{approved: true},
          //         {$or: [{description: {$in: mappedArr}}, {StartupName: {$in: mappedArr}}]}]}
          // }
          //find

          _context.next = 7;
          return regeneratorRuntime.awrap(postModel.find(condition) //condition on retrieved posts
          .populate('createdBy', {
            firstName: 1,
            lastName: 1
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
          }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({
            createdAt: -1
          }));

        case 7:
          posts = _context.sent;

          if (posts) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            "message": "no posts found"
          }));

        case 10:
          return _context.abrupt("return", res.status(200).json({
            message: 'posts are fetched successfully',
            search_Result: posts.length,
            posts: posts.length > 0 ? posts : "No Posts Found"
          }));

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);

          if (!_context.t0.statusCode) {
            _context.t0.statusCode = 500;
          }

          nxt(_context.t0);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.findPost = function _callee2(req, res, nxt) {
  var postId, post;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          //hold data
          postId = req.params.postId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(postModel.findById(postId).sort({
            createdAt: -1
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1
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

        case 4:
          post = _context2.sent;

          if (!(!post || !post.approved)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "this post is not found"
          }));

        case 7:
          return _context2.abrupt("return", res.status(200).json({
            // message: `the post ${postId} is retrieved successfully`,
            post: post
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);

          if (!_context2.t0.statusCode) {
            _context2.t0.statusCode = 500;
          }

          nxt(_context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.createPost = function _callee3(req, res, nxt) {
  var errors, _req$body, StartupName, description, facebookpage, websitelink, phone, addressLine, Price, Productname, Posttype, category, Category, _categoryId, user, pic, post, postt, usermodel;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context3.sent;

          if (errors.isEmpty()) {
            _context3.next = 7;
            break;
          }

          console.log(errors.array());
          return _context3.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 7:
          //hold data
          _req$body = req.body, StartupName = _req$body.StartupName, description = _req$body.description, facebookpage = _req$body.facebookpage, websitelink = _req$body.websitelink, phone = _req$body.phone, addressLine = _req$body.addressLine, Price = _req$body.Price, Productname = _req$body.Productname, Posttype = _req$body.Posttype, category = _req$body.category, Category = _req$body.Category, _categoryId = _req$body.categoryId;
          user = req.userId;
          pic = []; //handle files

          if (req.files) {
            req.files.forEach(function (file) {
              pic.push(data.DOMAIN + file.filename);
            });
          } //create new object


          post = new postModel({
            StartupName: StartupName,
            description: description,
            categoryId: _categoryId,
            facebookpage: facebookpage,
            websitelink: websitelink,
            phone: phone,
            addressLine: addressLine,
            Price: Price,
            Productname: Productname,
            Posttype: Posttype,
            pic: pic,
            category: category,
            Category: Category,
            createdBy: user
          }); //save in db

          _context3.next = 14;
          return regeneratorRuntime.awrap(post.save());

        case 14:
          postt = _context3.sent;
          _context3.next = 17;
          return regeneratorRuntime.awrap(userModel.findById(user));

        case 17:
          usermodel = _context3.sent;
          usermodel.posts.push(post);
          _context3.next = 21;
          return regeneratorRuntime.awrap(usermodel.save());

        case 21:
          return _context3.abrupt("return", res.status(201).json({
            // message: "your post is created successfully",
            post: postt
          }));

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](0);

          if (!_context3.t0.statusCode) {
            _context3.t0.statusCode = 500;
          }

          nxt(_context3.t0);

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

exports.updatePost = function _callee4(req, res, nxt) {
  var errors, postId, post, _req$body2, StartupName, description, facebookpage, websitelink, phone, addressLine, price, productname, posttype, category, pic, updatedPost;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context4.sent;

          if (errors.isEmpty()) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          postId = req.params.postId;
          _context4.next = 9;
          return regeneratorRuntime.awrap(postModel.findById(postId).populate('categoryId', {
            name: 1
          }));

        case 9:
          post = _context4.sent;

          if (!(!post || !post.approved)) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "the post is not exist"
          }));

        case 12:
          if (!(post.createdBy.toString() !== req.userId.toString())) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            message: "you're not authorized to update this post"
          }));

        case 14:
          //hold new values
          _req$body2 = req.body, StartupName = _req$body2.StartupName, description = _req$body2.description, facebookpage = _req$body2.facebookpage, websitelink = _req$body2.websitelink, phone = _req$body2.phone, addressLine = _req$body2.addressLine, price = _req$body2.price, productname = _req$body2.productname, posttype = _req$body2.posttype, category = _req$body2.category;
          pic = []; //handle files

          if (req.files != undefined) {
            req.files.forEach(function (file) {
              pic.push(data.DOMAIN + file.filename);
            });
          } //override


          post.StartupName = StartupName;
          post.description = description;
          post.categoryId = categoryId;
          post.facebookpage = facebookpage;
          post.websitelink = websitelink;
          post.phone = phone;
          post.addressLine = addressLine;
          post.productname = productname;
          post.price = price;
          post.category = category;
          post.posttype = posttype;
          post.pic = pic; //save in db

          _context4.next = 31;
          return regeneratorRuntime.awrap(post.save());

        case 31:
          updatedPost = _context4.sent;
          return _context4.abrupt("return", res.status(200).json({
            message: 'post is updated successfully',
            post: updatedPost
          }));

        case 35:
          _context4.prev = 35;
          _context4.t0 = _context4["catch"](0);

          if (!_context4.t0.statusCode) {
            _context4.t0.statusCode = 500;
          }

          nxt(_context4.t0);

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 35]]);
};

exports.deletePost = function _callee5(req, res, nxt) {
  var postId, post, result, comments, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          postId = req.params.postId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(postModel.findById(postId));

        case 4:
          post = _context5.sent;

          if (!(!post || !post.approved)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "the post is not exist"
          }));

        case 7:
          if (!(post.createdBy.toString() !== req.userId.toString())) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(401).json({
            message: "you're not authorized to delete this post"
          }));

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(postModel.findByIdAndRemove(postId));

        case 11:
          result = _context5.sent;
          _context5.next = 14;
          return regeneratorRuntime.awrap(commentModel.find({
            postId: postId
          }));

        case 14:
          comments = _context5.sent;

          if (comments) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            "message": "comments are not found"
          }));

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(commentModel.deleteMany({
            postId: postId
          }));

        case 19:
          _context5.next = 21;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 21:
          user = _context5.sent;

          if (user) {
            _context5.next = 24;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            "message": "user is not found"
          }));

        case 24:
          user.posts.pull(postId);
          _context5.next = 27;
          return regeneratorRuntime.awrap(user.save());

        case 27:
          return _context5.abrupt("return", res.status(200).json({
            message: 'the post is deleted successfully',
            post: result
          }));

        case 30:
          _context5.prev = 30;
          _context5.t0 = _context5["catch"](0);

          if (!_context5.t0.statusCode) {
            _context5.t0.statusCode = 500;
          }

          nxt(_context5.t0);

        case 34:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

exports.filter = function _callee6(req, res, nxt) {
  var errors, category, arr, page, posts;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context6.sent;

          if (errors.isEmpty()) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          //hold data
          category = req.query.categoryId;
          arr = [];
          page = req.query.page ? parseInt(req.query.page) : 1; //for pagination

          _context6.next = 11;
          return regeneratorRuntime.awrap(postModel.find({
            $and: [{
              categoryId: category
            }, {
              approved: true
            }]
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1
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
          }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({
            createdAt: -1
          }));

        case 11:
          posts = _context6.sent;
          //filter posts according to approving
          posts.forEach(function (Element) {
            if (Element.approved) {
              arr.push(Element);
            }
          }); //return posts

          return _context6.abrupt("return", res.status(200).json({
            message: 'the posts are retrieved successfully',
            search_Result: posts.length,
            posts: posts.length > 0 ? posts : "No Posts Found"
          }));

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);

          if (!_context6.t0.statusCode) {
            _context6.t0.statusCode = 500;
          }

          nxt(_context6.t0);

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.search = function _callee7(req, res, nxt) {
  var errors, key, arr, uniqueArray, page, wordnet, words, mappedArr, user, post;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context7.sent;

          if (errors.isEmpty()) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          key = req.query.key;
          arr = [];
          uniqueArray = [];
          page = req.query.page ? parseInt(req.query.page) : 1; //for pagination

          wordnet = new wordNetAPI();
          _context7.next = 13;
          return regeneratorRuntime.awrap(wordnet.lookupAsync(key));

        case 13:
          words = _context7.sent;
          console.log(words); //loop on all data in api to combine it

          words.forEach(function (word) {
            arr.push.apply(arr, _toConsumableArray(word.synonyms));
          }); //combine data with key

          if (!arr.includes(key)) {
            arr.push(key);
          } //remove deplicated value


          arr.forEach(function (val) {
            if (!uniqueArray.includes(val)) {
              uniqueArray.push(val);
            }
          }); //kda ana m3aya array h3ml find beha
          //regulare expression

          mappedArr = uniqueArray.map(function (el) {
            return new RegExp(el, "i");
          }); //add all this to user interests

          _context7.next = 21;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 21:
          user = _context7.sent;
          //check if element exist or not
          uniqueArray.map(function (el) {
            if (!user.interests.includes(el)) {
              user.interests.push(el);
            }
          });
          user.save(); //l database

          _context7.next = 26;
          return regeneratorRuntime.awrap(postModel.find({
            $or: [{
              $and: [{
                description: {
                  $in: mappedArr
                }
              }, {
                approved: true
              }]
            }, {
              $and: [{
                StartupName: {
                  $in: mappedArr
                }
              }, {
                approved: true
              }]
            }]
          }).populate('createdBy', {
            firstName: 1,
            lastName: 1
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
          }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({
            createdAt: -1
          }));

        case 26:
          post = _context7.sent;

          if (post) {
            _context7.next = 29;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "no posts found"
          }));

        case 29:
          return _context7.abrupt("return", res.status(200).json({
            message: "posts are fetched successfully",
            search_Result: post.length,
            posts: post.length > 0 ? post : "No posts Found"
          }));

        case 32:
          _context7.prev = 32;
          _context7.t0 = _context7["catch"](0);

          if (!_context7.t0.statusCode) {
            _context7.t0.statusCode = 500;
          }

          nxt(_context7.t0);

        case 36:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 32]]);
}; //for admin


exports.getAllUnapprovedPost = function _callee8(req, res, nxt) {
  var userId, page, user, posts;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = req.userId;
          page = req.query.page ? parseInt(req.query.page) : 1; //for pagination

          _context8.next = 5;
          return regeneratorRuntime.awrap(userModel.findById(userId));

        case 5:
          user = _context8.sent;

          if (!(!user || user.role !== 'admin')) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(401).json({
            message: "you're unauthorized to perform this operation"
          }));

        case 8:
          _context8.next = 10;
          return regeneratorRuntime.awrap(postModel.find({
            approved: false
          }).populate('categoryId', {
            name: 1
          }).sort({
            createdAt: -1
          }).skip((page - 1) * itemsPerPage).limit(itemsPerPage));

        case 10:
          posts = _context8.sent;
          ;
          return _context8.abrupt("return", res.status(200).json({
            search_Result: posts.length,
            posts: posts.length != 0 ? posts : "No posts found"
          }));

        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](0);

          if (!_context8.t0.statusCode) {
            _context8.t0.statusCode = 500;
          }

          nxt(_context8.t0);

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.approvPost = function _callee9(req, res, nxt) {
  var postId, userId, user, post;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          postId = req.params.postId;
          userId = req.userId;
          _context9.next = 5;
          return regeneratorRuntime.awrap(userModel.findById(userId));

        case 5:
          user = _context9.sent;

          if (!(!user || user.role !== 'admin')) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", res.status(401).json({
            message: "you're unauthorized to perform this operation"
          }));

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(postModel.findById(postId));

        case 10:
          post = _context9.sent;

          if (post) {
            _context9.next = 13;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "post is not found"
          }));

        case 13:
          post.approved = true;
          _context9.next = 16;
          return regeneratorRuntime.awrap(post.save());

        case 16:
          return _context9.abrupt("return", res.status(200).json({
            message: "post is approved successfully",
            post: post
          }));

        case 19:
          _context9.prev = 19;
          _context9.t0 = _context9["catch"](0);

          if (!_context9.t0.statusCode) {
            _context9.t0.statusCode = 500;
          }

          nxt(_context9.t0);

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.refusePost = function _callee10(req, res, nxt) {
  var postId, userId, user, post, deletePost, userOwnerId, userOwner;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          postId = req.params.postId;
          userId = req.userId;
          _context10.next = 5;
          return regeneratorRuntime.awrap(userModel.findById(userId));

        case 5:
          user = _context10.sent;

          if (!(!user || user.role !== 'admin')) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", res.status(401).json({
            message: "you're unauthorized to perform this operation"
          }));

        case 8:
          _context10.next = 10;
          return regeneratorRuntime.awrap(postModel.findById(postId));

        case 10:
          post = _context10.sent;

          if (post) {
            _context10.next = 13;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: "the post is not exist"
          }));

        case 13:
          _context10.next = 15;
          return regeneratorRuntime.awrap(postModel.findByIdAndRemove(postId));

        case 15:
          deletePost = _context10.sent;
          //delete it from user model
          userOwnerId = post.createdBy; //id l user l 3amel l post

          _context10.next = 19;
          return regeneratorRuntime.awrap(userModel.findById(userOwnerId));

        case 19:
          userOwner = _context10.sent;
          userOwner.posts.pull(postId);
          _context10.next = 23;
          return regeneratorRuntime.awrap(userOwner.save());

        case 23:
          return _context10.abrupt("return", res.status(200).json({
            message: "post is deleted successfully",
            post: deletePost
          }));

        case 26:
          _context10.prev = 26;
          _context10.t0 = _context10["catch"](0);

          if (!_context10.t0.statusCode) {
            _context10.t0.statusCode = 500;
          }

          nxt(_context10.t0);

        case 30:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 26]]);
};