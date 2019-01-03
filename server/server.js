const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');
var {todoModel} = require('./models/todo');
var {userModel} = require('./models/users');
var {ObjectID} = require('mongodb');

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

app.listen(port, () => {
    console.log(`app is listening @ ${port}`);
});

module.exports = {app};

