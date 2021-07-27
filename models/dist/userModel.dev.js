"use strict";

var _require = require('lodash'),
    pick = _require.pick;

var rendomBytes = require('crypto');

var data = require('../data');

var mongoose = require('mongoose');

var schema = mongoose.Schema;
var userModel = new schema({
  firstName: {
    type: String // required: true

  },
  lastName: {
    type: String // required: true

  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  pic: {
    type: String
  },
  gender: {
    type: String
  },
  DOB: {
    type: Date
  },
  bio: {
    type: String
  },
  job: {
    type: String
  },
  education: {
    type: String
  },
  summary: {
    type: String
  },
  facebook: {
    type: String
  },
  linkedIn: {
    type: String
  },
  gitHub: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  verified: {
    type: Boolean,
    "default": false
  },
  verificationCode: {
    type: String,
    required: false
  },
  resetPassToken: {
    type: String,
    required: false
  },
  posts: [{
    type: schema.Types.ObjectId,
    ref: 'post'
  }],
  interests: [{
    type: String
  }],
  comments: [{
    type: schema.Types.ObjectId,
    ref: 'Comment'
  }] // comments: [{
  //     type: schema.ty
  // }]

}, {
  timestamps: true
}); //methods

userModel.methods.getUserInfo = function () {
  return pick(this, ["_id", "firstName", "lastName", "email", "verified"]);
};

module.exports = mongoose.model('User', userModel);