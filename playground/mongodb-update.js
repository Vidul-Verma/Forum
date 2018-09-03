const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if(err){
        return console.log('Unable to connect to db');
    }
    const db = client.db('TodoApp');
    
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5b03dfdd66e11b1bf8d1c0c7')
    },{
        $set: {
            completed: true,
            text: 'eat lunch'
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log('Updated entry is ');
        console.log(JSON.stringify(result, undefined, 2));
    });
});