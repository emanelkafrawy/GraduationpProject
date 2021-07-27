"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var data = require('../data');

var bcrypt = require('bcryptjs');

var rendomBytes = require('crypto');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var userModel = require('../models/userModel');

var mail = require('../sendEmail');

var postModel = require('../models/postModel');

var commentModel = require('../models/commentModel');

exports.updateProfile = function _callee(req, res, nxt) {
  var errors, user, firstName, lastName, gender, DOB, bio, summary, fb, linked, github, job, education, city, address, country, updatedUser;
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
          _context.next = 8;
          return regeneratorRuntime.awrap(userModel.findById(req.userId));

        case 8:
          user = _context.sent;

          if (user) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 11:
          //hold data 
          firstName = req.body.firstName;
          lastName = req.body.lastName;
          gender = req.body.gender;
          DOB = req.body.DOB ? new Date(req.body.DOB).toISOString().replace(/\T.*/, '') : undefined; // delete the time and everything after

          bio = req.body.bio;
          summary = req.body.summary;
          fb = req.body.facebook;
          linked = req.body.linkedIn;
          github = req.body.gitHub;
          job = req.body.job;
          education = req.body.education;
          city = req.body.city;
          address = req.body.address;
          country = req.body.country; //override

          user.firstName = firstName ? firstName : user.firstName;
          user.lastName = lastName ? lastName : user.lastName;
          user.gender = gender;
          user.DOB = DOB;
          user.bio = bio;
          user.summary = summary;
          user.job = job;
          user.education = education;
          user.facebook = fb;
          user.linkedIn = linked;
          user.gitHub = github;
          user.city = city;
          user.address = address;
          user.country = country; //save in DB

          _context.next = 41;
          return regeneratorRuntime.awrap(user.save());

        case 41:
          updatedUser = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            message: "updated successfully",
            user: updatedUser
          }));

        case 45:
          _context.prev = 45;
          _context.t0 = _context["catch"](0);

          if (!_context.t0.statusCode) {
            _context.t0.statusCode = 500;
          }

          nxt(_context.t0);

        case 49:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 45]]);
};

exports.getAllUsers = function _callee2(req, res, nxt) {
  var users;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(userModel.find({}).select('firstName lastName email verified role pic gender DOB summary bio socialLinks job education location'));

        case 3:
          users = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            message: "You fetched all users successfully",
            search_result: users.length,
            users: users
          }));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);

          if (!_context2.t0.statusCode) {
            _context2.t0.statusCode = 500;
          }

          nxt(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.myProfile = function _callee3(req, res, nxt) {
  "";

  var _res$status$json, userId, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(userModel.findById(userId, 'firstName lastName email verified role pic gender DOB summary bio socialLinks location job education city address country').populate({
            path: 'posts',
            populate: {
              path: 'categoryId',
              model: 'Category',
              select: 'name'
            }
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 7:
          return _context3.abrupt("return", res.status(200).json((_res$status$json = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pic: user.pic,
            role: user.role,
            gender: user.gender,
            DOB: user.DOB,
            bio: user.bio,
            idd: userId,
            summary: user.summary,
            city: user.city,
            country: user.country,
            address: user.address,
            education: user.education,
            job: user.job,
            posts: user.posts.length
          }, _defineProperty(_res$status$json, "posts", user.posts), _defineProperty(_res$status$json, "comments", user.comments), _res$status$json)));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);

          if (!_context3.t0.statusCode) {
            _context3.t0.statusCode = 500;
          }

          nxt(_context3.t0);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.filter = function _callee4(req, res, nxt) {
  var errors, name, user;
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
          //hold data
          name = req.body.name;
          _context4.next = 9;
          return regeneratorRuntime.awrap(userModel.find({
            $or: [{
              firstName: {
                $regex: ".*".concat(name, ".*")
              }
            }, {
              lastName: {
                $regex: ".*".concat(name, ".*")
              }
            }]
          }).select('firstName lastName email verified role pic gender DOB summary bio socialLinks job location education'));

        case 9:
          user = _context4.sent;

          if (user) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "user not found"
          }));

        case 12:
          return _context4.abrupt("return", res.status(200).json({
            message: "the user is fetched successfully",
            search_result: user.length,
            user: user.length > 0 ? user : "No users Found"
          }));

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);

          if (!_context4.t0.statusCode) {
            _context4.t0.statusCode = 500;
          }

          nxt(_context4.t0);

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.getUser = function _callee5(req, res, nxt) {
  var userId, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.params.userId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(userModel.findById(userId, 'firstName lastName role pic gender DOB summary bio socialLinks location job education').populate('posts'));

        case 4:
          user = _context5.sent;

          if (user) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 7:
          return _context5.abrupt("return", res.status(200).json({
            message: "you fetched the user successfully",
            user: user
          }));

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);

          if (!_context5.t0.statusCode) {
            _context5.t0.statusCode = 500;
          }

          nxt(_context5.t0);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.blockUser = function _callee6(req, res, nxt) {
  var userId, user, deletedUser, posts, comments;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.params.userId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(userModel.findById(userId).select('firstName lastName role pic gender DOB summary bio socialLinks job education location'));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(userModel.findByIdAndRemove(userId));

        case 9:
          deletedUser = _context6.sent;
          _context6.next = 12;
          return regeneratorRuntime.awrap(postModel.find({
            createdBy: userId
          }));

        case 12:
          posts = _context6.sent;

          if (posts) {
            _context6.next = 15;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            "message": "there are no posts"
          }));

        case 15:
          _context6.next = 17;
          return regeneratorRuntime.awrap(postModel.deleteMany({
            createdBy: userId
          }));

        case 17:
          _context6.next = 19;
          return regeneratorRuntime.awrap(commentModel.find({
            userId: userId
          }));

        case 19:
          comments = _context6.sent;

          if (comments) {
            _context6.next = 22;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            "message": "there are no comments"
          }));

        case 22:
          _context6.next = 24;
          return regeneratorRuntime.awrap(commentModel.deleteMany({
            userId: userId
          }));

        case 24:
          return _context6.abrupt("return", res.status(200).json({
            message: "user is blocked",
            user: deletedUser
          }));

        case 27:
          _context6.prev = 27;
          _context6.t0 = _context6["catch"](0);

          if (!_context6.t0.statusCode) {
            _context6.t0.statusCode = 500;
          }

          nxt(_context6.t0);

        case 31:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.makeAdmin = function _callee7(req, res, nxt) {
  var errors, email, firstName, lastName, pass, pic, code, message, html, user, hashPass, newUser, adminUser;
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
          //hold data
          email = req.body.email;
          firstName = 'user';
          lastName = 'name';
          pass = 'Ebda2ha';
          pic = data.DOMAIN + 'defaultPhoto.png';
          code = rendomBytes.randomBytes(20).toString('hex'); //ll verification

          _context7.next = 14;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }).select('firstName lastName role pic gender DOB summary bio socialLinks education job location'));

        case 14:
          user = _context7.sent;

          if (user) {
            _context7.next = 26;
            break;
          }

          _context7.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(pass, 12));

        case 18:
          hashPass = _context7.sent;
          newUser = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: 'admin',
            pic: pic,
            verificationCode: code,
            password: hashPass
          });
          message = "the user ".concat(email, " was not exist but now is created successfully, became admin and has more authorization as you"); //set subject of mail

          html = "\n            <h1> Hello ".concat(firstName + lastName, " </h1>\n            <p> we are happy to inform you that you're added as admin in our website!\n            please check the mail ").concat(email, " with the password ").concat(pass, " to verify your account..\n            then you can logIn in our website with the same data </p>");
          _context7.next = 24;
          return regeneratorRuntime.awrap(newUser.save());

        case 24:
          _context7.next = 32;
          break;

        case 26:
          //if user exist 
          user.role = 'admin';
          html = "\n            <h1> Hello ".concat(user.firstName, " </h1>\n            <p> we are happy to inform you that you're now an admin in our website \n            and you now have more authorization </p>");
          message = "the user ".concat(email, " is already exist and now is admin and has more authorization as you");
          _context7.next = 31;
          return regeneratorRuntime.awrap(user.save());

        case 31:
          adminUser = _context7.sent;

        case 32:
          /* start sending mail to user email to inform user */
          mail.sendEmail(email, "making you admin", html); //l send mail to inform

          /* end sending mail */

          return _context7.abrupt("return", res.status(200).json({
            message: message
          }));

        case 36:
          _context7.prev = 36;
          _context7.t0 = _context7["catch"](0);

          if (!_context7.t0.statusCode) {
            _context7.t0.statusCode = 500;
          }

          nxt(_context7.t0);

        case 40:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 36]]);
};

exports.changePass = function _callee8(req, res, nxt) {
  var errors, userId, oldPass, newPass, confirmPass, user, equal, hashPass, newpass;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context8.sent;

          if (errors.isEmpty()) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          //hold data
          userId = req.userId;
          oldPass = req.body.oldPassword;
          newPass = req.body.newPassword;
          confirmPass = req.body.confirmPassword;
          _context8.next = 12;
          return regeneratorRuntime.awrap(userModel.findById(userId));

        case 12:
          user = _context8.sent;

          if (user) {
            _context8.next = 15;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 15:
          _context8.next = 17;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPass, user.password));

        case 17:
          equal = _context8.sent;

          if (equal) {
            _context8.next = 20;
            break;
          }

          return _context8.abrupt("return", res.status(401).json({
            message: "incorrect password"
          }));

        case 20:
          if (!(newPass !== confirmPass)) {
            _context8.next = 22;
            break;
          }

          return _context8.abrupt("return", res.status(401).json({
            message: "the two passwords are not matched"
          }));

        case 22:
          _context8.next = 24;
          return regeneratorRuntime.awrap(bcrypt.hash(newPass, 12));

        case 24:
          hashPass = _context8.sent;
          user.password = hashPass;
          _context8.next = 28;
          return regeneratorRuntime.awrap(user.save());

        case 28:
          newpass = _context8.sent;
          return _context8.abrupt("return", res.status(200).json({
            message: "you changed your password successfully"
          }));

        case 32:
          _context8.prev = 32;
          _context8.t0 = _context8["catch"](0);

          if (!_context8.t0.statusCode) {
            _context8.t0.statusCode = 500;
          }

          nxt(_context8.t0);

        case 36:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 32]]);
};

exports.createAvatar = function _callee9(req, res, nxt) {
  var user, pic, updatedUser;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log(req.body);
          _context9.prev = 1;
          debugger; //find user

          _context9.next = 5;
          return regeneratorRuntime.awrap(userModel.findById(req.userId).select('firstName lastName email role bio summary pic socialLinks location job education'));

        case 5:
          user = _context9.sent;

          if (user) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 8:
          if (req.file == undefined) {
            pic = data.DOMAIN + 'defaultPhoto.png';
          } else {
            pic = data.DOMAIN + req.file.filename;
          }

          user.pic = pic; //save in DB

          _context9.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          updatedUser = _context9.sent;
          return _context9.abrupt("return", res.status(200).json({
            // message: "updated successfully",
            user: updatedUser
          }));

        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](1);

          if (!_context9.t0.statusCode) {
            _context9.t0.statusCode = 500;
          }

          nxt(_context9.t0);

        case 20:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

exports.deleteAvatar = function _callee10(req, res, nxt) {
  var user, pic, updatedUser;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(userModel.findById(req.userId).select('firstName lastName email role bio summary pic socialLinks job education location'));

        case 3:
          user = _context10.sent;

          if (user) {
            _context10.next = 6;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 6:
          //handle l pic
          pic = data.DOMAIN + 'defaultPhoto.png';
          user.pic = pic; //save in DB

          _context10.next = 10;
          return regeneratorRuntime.awrap(user.save());

        case 10:
          updatedUser = _context10.sent;
          return _context10.abrupt("return", res.status(200).json({
            message: "deleted successfully",
            user: updatedUser
          }));

        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](0);

          if (!_context10.t0.statusCode) {
            _context10.t0.statusCode = 500;
          }

          nxt(_context10.t0);

        case 18:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; //favourites routes
// exports.viewUserFavourite = (req, res, nxt) => {
//     const favId = req.params.favId;
//     const userId = req.body.userId;
//     favouriteModel.findById(favId)
//     .populate('postId')
//     .then(fav => {
//         if (fav.userId.toString() !== userId.toString()) {
//             const err = new Error("you're not authorized to perform this operation");
//             err.statusCode = 401
//             throw err;
//         }
//         res.status(200).json({
//             message: "you fetched your favourite successfully",
//             favourite: fav
//         });
//     })
//     .catch(err => {
//         if (!err.statusCode) {
//             err.statusCode = 500
//         }
//         nxt(err);
//     })
// }