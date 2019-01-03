var mongoose = require('mongoose');

var userModel = mongoose.model('Users', {
    name: {
        type: String,
        required: [true, 'Why no names?'],
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory.'],
        minlength: 1,
        trm: true
    },
    password: {
        type: String,
        default: null
    },
    registeredAt: {
        type: Number,
        default: new Date().getTime()
    }
});

module.exports ={userModel};