const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');
var {todoModel} = require('./models/todo');
var {userModel} = require('./models/users');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate')

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    console.log(req.body);

    var todo = new todoModel({
        text: req.body.text,
        completed: req.body.completed
    });

    todo.save().then((docs) => {
        res.send(docs);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    todoModel.find().then((todos) => {
        res.status(200).send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    //Valid ID useing ID.isValid
    if(!ObjectID.isValid(id)){
        return res.send(404, 'ID is not valid!');
    }
    todoModel.findOne({_id : new ObjectID(id) }).then((todo) => {
        if(!todo){
            return res.status(404).send('No todos with the specified ID.');
        }
        res.status(200).send({todo});
    },(e) => {
        res.status(400).send(e);
    })
});

app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;

    //validtion of ID
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID is not valid!');
    }
    todoModel.findByIdAndDelete(id).then((todo) => {
        if(!todo){
            return res.status(404).send('No query result and nothing deleted.');
        }
        res.status(200).send({todo});
    },(err) => {
        res.status(400).send('Error occurred!', err);
    }).catch((e) => {
        console.log(e);
    })
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    //validtion of ID
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID is not valid!');
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    todoModel.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

//POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body,['name', 'email', 'password']);

    var user = new userModel(body);
    user.save().then((user) => {
        console.log(user)
        return user.generateAuthToken();
        // res.status(200).send(user);
    }).then((token)=> {
        console.log('User after token:', user)
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        res.status(400).send(e);
    })
});

//POST /users/login {email,password}
app.post('/users/login', (req,res) => {
    var body = _.pick(req.body, ['name', 'email', 'password']);

    userModel.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user)
        })
    }).catch((e) => {
        res.status(400).send(e);
    })
    // userModel.findOne({email: body.email}).then((user) => {
    //     if(!user){
    //         return res.status(400).send('Email is incorrect. Please check your email.');
    //     }
    //     bcrypt.compare(body.password, user.password, (err, result) => {
    //         if(!result){
    //             return res.status(401).send('Password is incorrect. Please check your password');
    //         }
    //         res.status(200).send(user)
    //     })
    // });

})

//route that requires Authentication
app.get('/users/me', authenticate, (req, res)=> {
    res.send(req.user)
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.listen(port, () => {
    console.log(`app is listening @ ${port}`);
});

module.exports = {app};

