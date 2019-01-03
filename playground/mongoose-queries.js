const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {todoModel} = require('./../server/models/todo');
const {userModel} = require('./../server/models/users');


// var id = '5c2b8b487c915e02ff4665ee';

// if(!ObjectID.isValid(id)){
//     console.log('Your ID is not valid!');
// };

// //mongoose では文字列を受け取ってObjectIDとしてそのままqueryに使うことができる
// todoModel.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// }, (e) => {
//     console.log('Error at findAll', e);
// });

// todoModel.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('One Todo', todo)
// }, (e) => {
//     console.log('Error at findOne', e);
// });

// todoModel.findById(id).then((todo) => {
//     if(!todo){
//         console.log('Id not found');
//     }
//     console.log('One Todo', todo);
// }).catch((e) => {
//     console.log(e);
// });


//User query
var userID = '5c2997b03a5a7d02d0a7ff92';
userModel.findById(userID).then((user) => {
    if(!user){
      return  console.log('No such user found...');
    }
    console.log('User Info:', user);
}).catch((e => {
    console.log(e);
}))