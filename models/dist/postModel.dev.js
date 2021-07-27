"use strict";

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

var schema = mongoose.Schema;
var postSchema = new schema((_ref = {
  StartupName: {
    type: String,
    required: true
  },
  facebookpage: String,
  websitelink: String,
  Posttype: String,
  Productname: {
    type: String
  },
  Price: Number,
  pic: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  addressLine: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  approved: {
    type: Boolean,
    "default": true
  }
}, _defineProperty(_ref, "Posttype", {
  type: String // enum: ['marketing', 'searchfund']

}), _defineProperty(_ref, "category", {
  type: String,
  required: true,
  "enum": ['Product Form', 'Startup Form']
}), _defineProperty(_ref, "categoryId", {
  type: schema.Types.ObjectId,
  required: true,
  ref: 'Category'
}), _defineProperty(_ref, "createdBy", {
  type: schema.Types.ObjectId,
  ref: 'User'
}), _defineProperty(_ref, "comments", [{
  type: schema.Types.ObjectId,
  ref: 'Comment'
}]), _ref), {
  timestamps: true
});
module.exports = mongoose.model('post', postSchema);