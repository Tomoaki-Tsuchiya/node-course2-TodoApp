const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var {app} = require('./../server');
var {todoModel} = require('./../models/todo');
var {userModel} = require('./../models/users')
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//Clearing everything to a standard line for every test case
beforeEach(populateTodos);
beforeEach(populateUsers);

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
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticatd', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', null)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    })
});

describe('POST /users', () => {
    it('should create a user', (done)=> {
        var name = 'tomotest';
        var email = 'test@gmail.com';
        var password = '123pass';

        request(app)
            .post('/users')
            .send({name,email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist;
                expect(res.body._id).toExist;
                expect(res.body.email).toBe(email)
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                userModel.findOne({email}).then((user) => {
                    expect(user).toExist;
                    expect(user.password).not.toBe(password);
                    done();
                })
                
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var name = 'tomotest2';
        var email = 'emailemail';
        var password = '';

        request(app)
            .post('/users')
            .send({name, email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors.email.message).toBe(email + ' is not valid');
                expect(res.body.errors.password.message).toBe('Path `password` is required.');
            })
            .end(done);
    });

    it('should not create user if email is in use', (done)=> {
        var name = 'tomotest3';
        var email = 'tomo@gmail.com';
        var password = 'password1!'

        request(app)
            .post('/users')
            .send({name, email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toBe(11000);
            })
            .end(done);
    })

});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        var name = users[0].name;
        var email = users[0].email;
        var password = users[0].password;

        request(app)
            .post('/users/login')
            .send({name, email, password})
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toExist;
                expect(res.body.email).toBe(email);
                var token = jwt.sign({_id: res.body._id, access: 'auth'},'abc123').toString();
                expect(res.headers['x-auth']).toBe(token);
            })
            .end((err) => {
                if(!err) {
                    return done(err);
                }
                userModel.findByToken(token).then((user) => {
                    expect(user).toExist;
                    done();
                }).catcu((e) => done());
                // request(app)
                //     .get('/users/me')
                //     .set('x-auth', token)
                //     .expect((res) => {
                //         console.log('2nd request is executed here!');
                //         expect(res).toExist;
                //     })
                //     .end(done);
            });
    });

    it('should reject invalid login', (done) => {
        var name = users[0].name;
        var email = users[0].email;
        var password = users[0].password　+ 'abc';

        request(app)
            .post('/users/login')
            .send({name, email, password})
            .expect(400)
            .expect((res) => {
                // console.log(res);
                // expect(res.text).toBe('No such user. Please check your email.');
                expect(res.text).toBe('Password is wrong.');
            })
            .end(done);
    });
}) ;
