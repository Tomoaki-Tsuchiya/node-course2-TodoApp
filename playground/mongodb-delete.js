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
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result)=>{
    //     console.log(result);
    // },(err)=>{
    //     console.log('Deletion failed due to an error.', err);
    // })

    //delete One
    // db.collection('Todos').deleteOne({text:'Eat Lunch'}).then((result) => {
    //     console.log(result);
    // },(err)  => {
    //     console.log('Deletion failed due to an error.', err);
    // })

    //findOne and Delete
    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
            console.log(result);
        },(err)  => {
            console.log('Deletion failed due to an error.', err);
        })

    // client.close();
});