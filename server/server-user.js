var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

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

var newUser = new userModel({
    name: 'Tomo',
    email: 'tomo@jp.com',
    password: 'abc'
});

newUser.save().then((doc) => {
    console.log(doc);
}, (e) => {
    console.log('Unble to add a user.',  e);
});