const {MongoClient, ObjectID} = require('mongodb');

const urls = 'mongodb://localhost:27017/TodoApp';

//次の１行でurlからcollectionを指定するが、その作成は明示的に作成の命令を出した時だけ。
MongoClient.connect(urls, (err, client) => {
    if(err){
        return console.log('Connection to DB failed...');
    }

    const db = client.db('TodoApp');
    console.log('Connection succeedded to mongoDB Server at ', urls);

    //delete many
    db.collection('Users').deleteMany({name:'Tomo'}).then((result) => {
        console.log(result);
    });

    //delete One
    // db.collection('Users').deleteOne({name: 'Tomo'}).then((result) => {
    //   console.log(result);  
    // })

    //findOne and Delete
//    db.collection('Users').findOneAndDelete({
//        _id: new ObjectID('5c279c50569d4b20d75a75a4')
//    }).then((result) => {
//        console.log(result)
//    });

    // client.close();
});