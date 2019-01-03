var mongoose = require('mongoose');

//これは使えない。MongooseError: The `uri` parameter to `openUri()` must be a string, got "function".
// var mongoUrl = () => {
//     if(!process.env.PORT) {
//         console.log(porce.env.PORT);
//         return 'mongodb://localhost:27017/TodoApp'
//     }
//     return 'mongodb://tomotaro:tom0test@ds041140.mlab.com:41140/todoapp'
// }

var mongoUrl = (!process.env.PORT)? 'mongodb://localhost:27017/TodoApp' : 'mongodb://tomotaro:tom0test@ds041140.mlab.com:41140/todoapp';

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect(mongoUrl);

module.exports = {mongoose};