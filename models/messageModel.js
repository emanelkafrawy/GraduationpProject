const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    body: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});
module.exports = mongoose.model('Message', messageSchema);



