const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if(err){
        return console.log('Unable to connect to db');
    }
    const db = client.db('TodoApp');
    
    db.collection('Todos').find().toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) =>{
       console.log('unable to fetch todos',err); 
    });
    
    db.collection('Users').find({name: 'myName'}).toArray().then((docs) =>{
        console.log('Users with name as myName:::');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('No users with that name',err); 
    });
});