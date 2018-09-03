const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if(err){
        return console.log('Unable to connect to db');
    }
    const db = client.db('TodoApp');
    
    db.collection('Todos').findOneAndDelete({text: 'each lunch'}).then((result) =>{
       console.log(JSON.stringify(result, undefined, 2)); 
    });
});