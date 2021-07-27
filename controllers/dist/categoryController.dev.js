"use strict";

var Category = require('../models/categoryModel');

var User = require('../models/userModel');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var Posts = require('../models/postModel');

exports.getAllCategory = function _callee(req, res, next) {
  var categories;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Category.find().select('name').populate('adminId', 'firstName lastName'));

        case 3:
          categories = _context.sent;
          res.status(200).json({
            // message: 'Fetched all data successfully',
            categories: categories
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);

          if (!_context.t0.statusCode) {
            _context.t0.statusCode = 500;
          }

          next(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getCategory = function _callee2(req, res, next) {
  var categoryId, category, error, _error, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          categoryId = req.params.categoryId;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Category.findById(categoryId).populate('adminId', 'firstName lastName'));

        case 3:
          category = _context2.sent;
          _context2.prev = 4;

          if (category) {
            _context2.next = 9;
            break;
          }

          error = new Error("Couldn't found category.");
          error.statusCode = 404;
          throw error;

        case 9:
          if (!(category.adminId._id.toString() !== req.userId)) {
            _context2.next = 13;
            break;
          }

          _error = new Error('NOT authorized.');
          _error.statusCode = 403;
          throw _error;

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(User.findById(category.adminId));

        case 15:
          user = _context2.sent;
          res.status(200).json({
            message: 'category fetched',
            category: category
          });
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](4);

          if (!_context2.t0.statusCode) {
            _context2.t0.statusCode = 500;
          }

          next(_context2.t0);

        case 23:
          ;

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 19]]);
};

exports.AddCategory = function _callee3(req, res, next) {
  var errors, user, name, category;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(validationResult(req));

        case 2:
          errors = _context3.sent;

          if (errors.isEmpty()) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 5:
          _context3.prev = 5;
          _context3.next = 8;
          return regeneratorRuntime.awrap(User.findById(req.userId));

        case 8:
          user = _context3.sent;

          if (!user) {
            res.status(200).json({
              message: 'not authorized'
            });
          }

          name = req.body.name;
          category = new Category({
            name: name,
            adminId: req.userId
          });
          _context3.next = 14;
          return regeneratorRuntime.awrap(category.save());

        case 14:
          res.status(200).json({
            message: 'Category created successfully',
            category: category,
            admin: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
          _context3.next = 21;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](5);

          if (!_context3.t0.statusCode) {
            _context3.t0.statusCode = 500;
          }

          next(_context3.t0);

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 17]]);
};

exports.updateCategory = function _callee4(req, res, next) {
  var errors, categoryId, name, category, error, _error2, result;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(validationResult(req));

        case 2:
          errors = _context4.sent;

          if (errors.isEmpty()) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 5:
          categoryId = req.params.categoryId;
          name = req.body.name;
          _context4.prev = 7;
          _context4.next = 10;
          return regeneratorRuntime.awrap(Category.findById(categoryId).populate('adminId', 'firstName lastName'));

        case 10:
          category = _context4.sent;

          if (!category) {
            error = new Error('Category not found ');
            error.statusCode = 404;
            next(error);
          }

          if (!(category.adminId._id.toString() !== req.userId)) {
            _context4.next = 16;
            break;
          }

          _error2 = new Error('NOT authorized.');
          _error2.statusCode = 403;
          throw _error2;

        case 16:
          category.name = name; // category.adminId = adminId;

          _context4.next = 19;
          return regeneratorRuntime.awrap(category.save());

        case 19:
          result = _context4.sent;
          res.status(200).json({
            message: 'Category updated successfully',
            category: result
          });
          _context4.next = 27;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](7);

          if (!_context4.t0.statusCode) {
            _context4.t0.statusCode = 500;
          }

          next(_context4.t0);

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[7, 23]]);
};

exports.deleteCategory = function _callee5(req, res, next) {
  var categoryId, category, posts, error, _error3;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          categoryId = req.params.categoryId;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Category.findById(categoryId));

        case 4:
          category = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(Posts.deleteMany({
            categoryId: categoryId
          }));

        case 7:
          posts = _context5.sent;

          if (!category) {
            error = new Error('Category not found ');
            error.statusCode = 404;
            next(error);
          }

          if (!(category.adminId._id.toString() !== req.userId)) {
            _context5.next = 13;
            break;
          }

          _error3 = new Error('NOT authorized.');
          _error3.statusCode = 403;
          throw _error3;

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(Category.findByIdAndRemove(categoryId));

        case 15:
          res.status(200).json({
            message: 'Deleted successfully'
          });
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](1);

          if (!_context5.t0.statusCode) {
            _context5.t0.statusCode = 500;
          }

          next(_context5.t0);

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 18]]);
};