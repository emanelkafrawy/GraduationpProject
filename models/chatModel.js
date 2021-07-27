const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
        type: String,
    },
},{
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);

