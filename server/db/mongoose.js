var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://tomotaro:tom0test@ds041140.mlab.com:41140/todoapp');

module.exports = {mongoose};