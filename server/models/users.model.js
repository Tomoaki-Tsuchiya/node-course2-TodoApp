const mongoose = require('mongoose');
const validator = require('validator');

//Userが持つpropertyの例
// {
//     email :'tomo@email.com',
//     password : 'password123',
//     tokens : [{
//         access: 'auth',
//         token: 'aslkdfuoajlaksdjkfd'
//     }]
// }

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
        trm: true,
        unique: true,
        validate: {
            // validator : (value) => {
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,
            message : '{VALUE} is not valid'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'password too short f**king damn!']
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports ={userModel};