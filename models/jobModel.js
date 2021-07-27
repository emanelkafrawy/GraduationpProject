const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    JobName: {
        type: String,
        required: true
    },
    JobDescription: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true

    },
    Salary: {
        type: String,
        // required: true

    },
    addressLine:{
        type: String,
        required: true

    },
    websitelink:{
        type: String,
        // required: true

    },
    facebookpage:{
        type: String,
        // required: true

    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = mongoose.model('Job', JobSchema);