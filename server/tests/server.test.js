const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {todoModel} = require('./../models/todo');

var todos = [{
    _id: new ObjectID(),
    text: 'First test Todo'
}, {
    _id: new ObjectID(),
    text: "Second test Todo"
}];

//Clearing everything to a standard line for every test case
beforeEach((done) => {
    todoModel.remove({}).then(() => {
        return todoModel.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'to Buy a book';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                console.log('You got here');
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                todoModel.find({text}).then((todos)=> {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                todoModel.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> {
                    return done(e);
                });
            })
    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id' ,() => {
    it('should findByID', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text)
            }).end(done);
    });

    it('should return 404 back if no todo found', (done) => {
        var newID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${newID}`)
            .expect(404).end(done);
    });

    it('should return 404 for non-objectIDs', (done) => {
        request(app)
            .get('/todos/123456')
            .expect(404)
            .end(done);
    })



})
