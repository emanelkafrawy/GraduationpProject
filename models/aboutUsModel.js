const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutUsSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})


module.exports = mongoose.model('AboutUs', AboutUsSchema);