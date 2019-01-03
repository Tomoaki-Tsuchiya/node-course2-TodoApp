const {MongoClient, ObjectID} = require('mongodb');

const urls = 'mongodb://localhost:27017/TodoApp';

//次の１行でurlからcollectionを指定するが、その作成は明示的に作成の命令を出した時だけ。
MongoClient.connect(urls, (err, client) => {
    if(err){
        return console.log('Connection to DB failed...');
    }

    const db = client.db('TodoApp');
    console.log('Connection succeedded to mongoDB Server at ', urls);

    // //find()はCursorであり、そのあとの関数により戻り値が変化。また、toArrayはPromiseを返す。
    // db.collection('Todos').find({
    //     _id: new ObjectID('5c278641569d4b20d75a70cc')
    // }).toArray().then((docs)=> {
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (error) => {
    //     console.log('Unable to fetch todos', error);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', error);
    // });
    db.collection('Users').find({name:'Tomo'}).count().then((count) => {
        console.log(`User Tomo count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch the result of the specific user', err)
    })

    // client.close();
});