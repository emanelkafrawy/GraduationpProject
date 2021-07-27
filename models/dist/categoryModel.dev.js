"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var categoryModel = new Schema({
  name: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Category', categoryModel);