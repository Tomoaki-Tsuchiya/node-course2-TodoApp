// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');
//Destructuring 
// var user = {
//     name: 'Tomo',
//     age: 28
// };
// var {name} = user;
// console.log(name);

const urls = 'mongodb://localhost:27017/TodoApp';

//次の１行でurlからcollectionを指定するが、その作成は明示的に作成の命令を出した時だけ。
MongoClient.connect(urls, (err, client) => {
    if(err){
        return console.log('Connection to DB failed...');
    }

 
    console.log('Connection succeedded to mongoDB Server at ', urls);

    // const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Error occurred inserting a data', err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    // // Insert new doc into Users(name, age, location)
    // const db2 = client.db('TodoApp');
    // db2.collection('Users').insertOne({
    //     name: 'Tomo',
    //     age: 28,
    //     location: 'Sapporo'
    // }, (err,result) => {
    //     if(err){
    //         return console.log('User addition failed...', err);
    //     }

    //     console.log('User addition succeeded!');
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    client.close();
});