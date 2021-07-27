"use strict";

var bcrypt = require('bcryptjs');

var rendomBytes = require('crypto');

var _require = require('jsonwebtoken'),
    sign = _require.sign;

var data = require('../data');

var _require2 = require('express-validator'),
    validationResult = _require2.validationResult;

var userModel = require('../models/userModel');

var mail = require('../sendEmail');

exports.SignUp = function _callee(req, res, nxt) {
  var errors, confirmPassword, firstName, lastName, email, _password, role, pic, code, hashedPass, _user, userr, html;

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
          //hold data from parsing body
          confirmPassword = req.body.confirm;
          firstName = req.body.firstName;
          lastName = req.body.lastName;
          email = req.body.email;
          _password = req.body.password;
          role = req.body.role;
          pic = data.DOMAIN + 'defaultPhoto.png';
          code = rendomBytes.randomBytes(3).toString('hex'); //ll verification

          if (!(_password !== confirmPassword)) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "the two password are not matched "
          }));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(_password, 12));

        case 18:
          hashedPass = _context.sent;
          //add to DB
          _user = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPass,
            role: role,
            pic: pic,
            verificationCode: code
          }); //save in DB

          _context.next = 22;
          return regeneratorRuntime.awrap(_user.save());

        case 22:
          userr = _context.sent;

          /* start sending mail to user email to verify its account */
          html = "\n        <h1> Hello ".concat(userr.firstName, " </h1>\n        <p>your code is ").concat(userr.verificationCode, " please enter it correctly to verify your account</p>\n        ");
          mail.sendEmail(userr.email, "Verify Account", html);
          /* end sending verification mail */

          return _context.abrupt("return", res.status(201).json({
            message: "new user is added successfully, please check your email to verify your account",
            user: userr
          }));

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            message: "an error occur"
          }));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

exports.verifyEmail = function _callee2(req, res, nxt) {
  var code, _user2, userr;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          code = req.body.code;
          _context2.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            verificationCode: code
          }));

        case 4:
          _user2 = _context2.sent;

          if (_user2) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "invalid code"
          }));

        case 7:
          _user2.verified = true;
          _context2.next = 10;
          return regeneratorRuntime.awrap(_user2.save());

        case 10:
          userr = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            message: "your account is verified",
            user: userr.email
          }));

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            message: "an error occur"
          }));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.login = function _callee3(req, res, nxt) {
  var errors, email, _password2, _user3, equal, payload, token;

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
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          //hold data
          email = req.body.email;
          _password2 = req.body.password;
          _context3.next = 10;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 10:
          _user3 = _context3.sent;

          if (_user3) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(_password2, _user3.password));

        case 15:
          equal = _context3.sent;

          if (equal) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            message: "incorrect password"
          }));

        case 18:
          if (_user3.verified) {
            _context3.next = 20;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            message: "your account is not verified, please check the account ".concat(_user3.email, " and verify it to login")
          }));

        case 20:
          //generate token
          payload = {
            firstName: _user3.firstName,
            lastName: _user3.lastName,
            email: _user3.email,
            role: _user3.role,
            verified: _user3.verified,
            userId: _user3._id.toString()
          };
          _context3.next = 23;
          return regeneratorRuntime.awrap(sign(payload, data.SECRET, {
            expiresIn: "1 day"
          }));

        case 23:
          token = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            // message: "you're logged in",
            // user: 'welcome ' + user.firstName,
            // data: user.getUserInfo(),
            idd: _user3._id,
            token: "".concat(token)
          }));

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            message: "an error occur"
          }));

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.getResetPass = function _callee4(req, res, nxt) {
  var email, errors, _user4, payload, userr, html;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.body.email; //validation

          _context4.next = 4;
          return regeneratorRuntime.awrap(validationResult(req));

        case 4:
          errors = _context4.sent;

          if (errors.isEmpty()) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 9:
          _user4 = _context4.sent;

          if (_user4) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "user not exist"
          }));

        case 12:
          //generate token 
          payload = {
            firstName: _user4.firstName,
            lastName: _user4.lastName,
            email: _user4.email,
            role: _user4.role,
            verified: _user4.verified,
            userId: _user4._id.toString()
          };
          _context4.next = 15;
          return regeneratorRuntime.awrap(sign(payload, data.SECRET, {
            expiresIn: "1s"
          }));

        case 15:
          global.resetToken = _context4.sent;
          _user4.resetPassToken = resetToken;
          _context4.next = 19;
          return regeneratorRuntime.awrap(_user4.save());

        case 19:
          userr = _context4.sent;

          /* start sending mail to user email to reset password */
          html = "\n        <h1> Hello ".concat(userr.firstName, " </h1>\n        <p> please click to the following link to reset password</p>\n        <a href=\"").concat(data.DOMAIN, "auth/postNewPass/").concat(resetToken, "\"> reset password </a>\n        ");
          _context4.next = 23;
          return regeneratorRuntime.awrap(mail.sendEmail(userr.email, "reset password", html));

        case 23:
          return _context4.abrupt("return", res.status(200).json({
            message: "email is sent successfully! check it to reset password",
            user: userr.email
          }));

        case 26:
          _context4.prev = 26;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            message: "an error occured"
          }));

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

exports.postNewPass = function _callee5(req, res, nxt) {
  var errors, _password3, confirmPass, tokenn, _user5, _hashPass, _response, hashPass, response;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(validationResult(req));

        case 3:
          errors = _context5.sent;

          if (errors.isEmpty()) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(422).json({
            errors: errors.array()
          }));

        case 6:
          console.log(resetToken);

          if (!resetToken) {
            _context5.next = 25;
            break;
          }

          _password3 = req.body.password;
          confirmPass = req.body.confirm;
          tokenn = req.params.token;
          _context5.next = 13;
          return regeneratorRuntime.awrap(userModel.findOne({
            resetPassToken: tokenn
          }));

        case 13:
          _user5 = _context5.sent;

          if (!(_password3 !== confirmPass)) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", res.status(401).json({
            message: "the two passwords are not matched"
          }));

        case 16:
          _context5.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(_password3, 12));

        case 18:
          _hashPass = _context5.sent;
          //edit in model w a5ly kol 7aga zy ma kant
          _user5.password = _hashPass;
          _user5.resetPassToken = undefined; //////////;

          _context5.next = 23;
          return regeneratorRuntime.awrap(_user5.save());

        case 23:
          _response = _context5.sent;
          res.status(200).json({
            message: "your password is reset successfully"
          });

        case 25:
          _context5.next = 27;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

        case 27:
          hashPass = _context5.sent;
          //edit in model w a5ly kol 7aga zy ma kant
          user.password = hashPass;
          user.resetPassToken = undefined; //////////;

          _context5.next = 32;
          return regeneratorRuntime.awrap(user.save());

        case 32:
          response = _context5.sent;
          res.status(200).json({
            message: "your password is reset successfully"
          });
          _context5.next = 39;
          break;

        case 36:
          _context5.prev = 36;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", res.status(401).json({
            message: "the token is expired! try to request reset password again from http://localhost:3000/auth/resetPassword"
          }));

        case 39:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 36]]);
};