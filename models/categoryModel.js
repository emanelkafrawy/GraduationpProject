const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryModel = new Schema({
    name: {
        type: String,
        required: true
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Category', categoryModel);