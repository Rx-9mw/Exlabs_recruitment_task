const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    firstName:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);