const jwt = require('jsonwebtoken');
const {SHA256} = require('crypto-js')
const bcrypt = require('bcryptjs')

var password = '123abc!';

bcrypt.genSalt(10,(err, salt)=> {
    bcrypt.hash(password, salt, (err, hash)=> {
        console.log(hash);
    })
});

var hashedPassword ='$2a$10$1noozH75sTmn3Ym38vc2Te0J1gyGs8sMtnV83TQkJ8HLpD52mOBKy';

bcrypt.compare(password,hashedPassword,(err, result)=> {
    console.log(result)
})

// var message = 'I am a hero number 1';
// var hash = SHA256(message).toString()

// console.log(`message: ${message}`);
// console.log(`Hash: ${hash}`);


// var data = {
//     id: 1
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// };

// token.data.id = 2;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(data) + 'somesecret').toString();
// if(resultHash === token.hash) {
//     console.log('Data is not changed.');
// }else {
//     console.log('Data is changed! Do not trust!');
// }


// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'secretKey');
// console.log(token);

// var decoded = jwt.verify(token, 'secretKey');
// console.log(`decoded: `, decoded);