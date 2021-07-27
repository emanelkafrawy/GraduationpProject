const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postSchema = new schema({
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
        type: String,
    }],
    description:{
        type: String,
        required: true
    },
    addressLine:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    Posttype: {
        type: String,
        // enum: ['marketing', 'searchfund']
    },
    category:{
        type: String,
        required: true,
        enum: ['Product Form' , 'Startup Form']
    },
    categoryId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    createdBy: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model('post', postSchema);