const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ =require('lodash')
const bcrypt = require('bcryptjs')

//Userが持つpropertyの例
// {
//     email :'tomo@email.com',
//     password : 'password123',
//     tokens : [{
//         access: 'auth',
//         token: 'aslkdfuoajlaksdjkfd'
//     }]
// }

var UserSchema = new mongoose.Schema({
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

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id', 'name', 'email']);
}

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(()=> {
        return token;
    })
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, 'abc123')
    }catch(e){
        return Promise.reject('Decoding error of the specified token!!')
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        console.log('Hashing the password...')
        //hash the user.password
        bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            console.log(`user.password: ${user.password}`)
            console.log(`user.name: ${user.name}`)
            console.log(`user.email: ${user.email}`)
            next();
        })
        //ここでnext()呼んだときは失敗した
        // next();
    })
    }else{
        next();
    }
})

var userModel = mongoose.model('Users', UserSchema);


module.exports ={userModel};