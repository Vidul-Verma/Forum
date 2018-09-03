//NOT INSTALLED.. JST AN EXAMPLE OF HOW JWT WORKS
const {SHA256} = require('crypto-js');


var data = {
    id: 1
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data)+"saltadded").toString()
}


var resultHash = SHA256(JSON.stringify(token.data) + "saltadded").toString();

if(resultHash == token.hash){
    console.log('Data was not changed ');
}else{
    console.log("DATA changed");
}


