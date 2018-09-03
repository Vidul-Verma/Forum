const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, client) =>{
    if(err){
        return console.log('Unable to connect to db');
    }
    console.log('Connected to the database');
    //GET ACCESS TO THE DATABASE REFERENCE
    const db = client.db('TodoApp');
    
    //CREATE A NEW COLLECTION IN DB AND INSERT A DOCUMENT
    db.collection('Todos').insertOne({
        text: 'Hello 22',
        completed: false
    }, (err, result) =>{
        if(err){
            return console.log("unable to insert todo", err);
        }
        //result.ops contains all of the documents
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    
    db.collection('Users').insertOne({
        name: 'myName',
        age: 50,
        location: 'myLocation'
    }, (err, result) => {
        if(err){
            return console.log("Unable to insert user", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    
    client.close(); 
});

