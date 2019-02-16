const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {todoModel} = require('./../../models/todo');
const {userModel} = require('./../../models/users');


const todos = [{
    _id: new ObjectID(),
    text: 'First test Todo'
}, {
    _id: new ObjectID(),
    text: "Second test Todo",
    completed: true,
    completedAt: 333
}];

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        name: 'tomo1',
        email: 'tomo@gmail.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id:userOneId, access:'auth'}, 'abc123').toString()
            // function(){
            //     return jwt.sign({_id:this._id, access:'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        name: 'tomo2',
        email: 'tomo2@gmail.com',
        password: 'userTwoPass'
    }
]

const populateTodos = (done) => {
    todoModel.deleteMany({}).then(() => {
        return todoModel.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    userModel.remove({}).then(() => {
        var userOne = new userModel(users[0]).save();
        var userTwo = new userModel(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};