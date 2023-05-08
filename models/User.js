const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    isProvider: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    currentStatus: {
        type: Boolean,
        required: true
    },
    datingCharge: {
        type: Number,
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    friends: {
        type: Array
    },
    friendsPending: {
        type: Array
    }
}, {
    timestamps: true
})

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;