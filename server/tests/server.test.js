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
    text: "Second test Todo",
    completed: true,
    completedAt: 333
}];

//Clearing everything to a standard line for every test case
beforeEach((done) => {
    todoModel.deleteMany({}).then(() => {
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
                expect(res.body.todos.length).toBe(2);
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
                expect(res.body.todo.text).toBe(todos[0].text)
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
    });



});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                todoModel.findById(hexID).then((result) => {
                    expect(result).toNotExist;
                    done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

    it('should return 404 if no todo got back', (done) => {
        var newID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${newID}`)
            .expect(404).end(done);
    });

    it('should return 404 if ID is not valid', (done) => {
        request(app)
            .delete('/todos/123456')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        //grab id of the first item
        var hexId = todos[0]._id.toHexString();
        var body = {
            text: 'update first todo',
            completed: true
        };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                todoModel.findById(hexId).then((result) => {
                    expect(result).toExist;
                    expect(result.text).toBe(body.text);
                    expect(result.completed).toBe(true);
                    expect(typeof result.completedAt).toBe('number');
                    done();
                }).catch((e) => {
                    return done(e);
                }); 
            });
    });

    it('should clear completedAt when todo is not completd', (done) => {
        var body = {
            text: 'update second todo',
            completed: false
        };
        var hexId = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                todoModel.findById(hexId).then((todo) => {
                    expect(todo).toExist;
                    expect(todo.completed).toBe(body.completed);
                    expect(todo.text).toBe(body.text);
                    expect(todo.completedAt).toNotExist;
                    done();
                }).catch((e) => done(e));
            });
    });
})
