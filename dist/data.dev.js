"use strict";

// import {config} from 'dotenv';
// config();
var dotenv = require('dotenv');

dotenv.config();
exports.DB = process.env.APP_DB;
exports.SECRET = process.env.APP_SECRET;
exports.DOMAIN = process.env.APP_DOMAIN;
exports.SENDGRID_API = process.env.SENDGRID_API;
exports.PORT = process.env.APP_PORT;
exports.EMAIL = process.env.APP_EMAIL;
exports.PASS = process.env.APP_PASS;