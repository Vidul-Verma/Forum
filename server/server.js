//const _ = require('lodash');
const express = require('express');
//const bodyParser = require('body-parser');
//const {ObjectID} = require('mongodb');
const config = require("../config/config.js");
const path = require('path');
const socketIO = require('socket.io');
//CONFIGURE HTTP TO MAKE EXPRESS TO WORK WITH it
const http = require('http');

const cookieParser = require('cookie-parser');


var userroutes = require('./controller/controller.js');
var threadroutes = require('./controller/controllerforum.js');
var userchatroutes = require('./controller/controllerchats.js');



//SETUP PORT FOR HEROKU
const port = process.env.PORT || 8080;


//CREATE SERVER USING HTTP LIBRARY
//app.listen also calls the same method passing in the app as arg
// var server = http.createServer((req, res) =>{
//
// })

//WE ARE NOW USING HTTP SERVER AS OPPOSED TO EXPRESS SERVER
var app = express();




//SET UP TEMPLATE ENGINE
app.set('view engine', 'ejs');

const publicPath = path.join(__dirname + '/public');
app.use(express.static(publicPath));
////ACCESS THE MIDDLEWARE
//app.use(bodyParser.json());

app.use('', userroutes);
app.use(cookieParser());

//CREATE HTTP SERVER AND SET APP AS EXPRESS

var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

userchatroutes(app, port, io);
threadroutes(app, port);






// //USING THIS WE CAN COMMICATE WITH THE SERVER AND THE CLIENT
// var io = socketIO(server);
//
// //REGISTER FOR EVENT
// io.on('connection', (socket) =>{
    // console.log("new client connected");
// var socketId  = socket.id;


// socket.on('join', (params, callback) =>{
//   if(!isRealString(params.name) || !isRealString(params.group)){
//     callback('Name and room name are required')
//   }
//
//   //CREATE A SOCKET room
//   socket.join(params.group);
//   //LEAVE THE ROOM  socket.leave
// //EMMIT TO EVERYONE CONNECTED TO ROOM  io.to('roomname').emit
// // BROADCAST socket.broadcast.to('roomname').emit
// //check if user already exist in another room then remove
// users.removeUser(socket.id);
// users.addUser(socket.id, params.name, params.group);
//
// io.to(params.group).emit('updateUserList', users.getUserList(params.group));
// //EMIT MSG BY ADMIN TO NEW User
// socket.emit('newMsg', generateMsg('Admin', 'Welcome to the app'));
//
// socket.broadcast.to(params.group).emit('newMsg', generateMsg('Admin', params.name+ 'has joined'));
//   callback();
// });

// //GET MSG FROM THE CLIENT
//   socket.on('createMsg', (msg, callback) =>{
//     console.log(msg);
//
//     var user = users.getUser(socket.id);
//
//     if (user && isRealString(msg.msg)){
//       io.to(socketId).emit('newMsg', generateMsg(msg.from, msg.msg));
//     }
//     // SEND MSG TO EVERYBODY
//
//     callback('hello from the server');
//     // //BROADCAST
//     // socket.broadcast.emit('newMsg', {
//     //   from: msg.from,
//     //   text: msg.text,
//     //   createdAt: new Date().getTime()
//     // });
//
//   });

  // socket.on('disconnect', () =>{
  //   console.log("new user removed");
  //   var user = users.removeUser(socket.id);
  //
  //   if(user){
  //     io.to(user.group).emit('updateUserList', users.getUserList(user.group));
  //     io.to(user.group).emit('newMsg', generateMsg('Admin', user.name + ' has left'));
  //   }
  // });

// });
server.listen(port, () =>{

   console.log('App started at port ' + port);
});
