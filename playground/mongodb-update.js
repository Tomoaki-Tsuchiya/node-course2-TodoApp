const {MongoClient, ObjectID} = require('mongodb');

const urls = 'mongodb://localhost:27017/TodoApp';

//次の１行でurlからcollectionを指定するが、その作成は明示的に作成の命令を出した時だけ。
MongoClient.connect(urls, (err, client) => {
    if(err){
        return console.log('Connection to DB failed...');
    }

    const db = client.db('TodoApp');
    console.log('Connection succeedded to mongoDB Server at ', urls);

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c279c3d569d4b20d75a759c')
    },{
        $set: {
            name: 'Tao'
        },
        $inc: {
            age: 3
        }
    },{
        returnOriginal:false
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    },(err) => {
        console.log('Error occurred!', err);
    })

    // client.close();
});