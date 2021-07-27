const mongoose = require('mongoose');
const schema = mongoose.Schema;
const commentModel = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    postId : {
        type: schema.Types.ObjectId,
        ref: 'Post'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Comment', commentModel );
