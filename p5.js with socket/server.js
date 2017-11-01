'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors')

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => {  res.sendFile(INDEX) } )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(server);



var clientNbr = 0;
var mouses = [];


setInterval(() => {
	console.log(mouses)
}, 1000)
io.on('connection', (socket) => {
  console.log('Client connected' + socket.id);
  socket.emit('id', { id : socket.id, mouses : mouses });
  // socket.broadcast.emit('newClient', socket.id);
 socket.on('newClient', (username) => {
 	mouses.push({ username : username, id : socket.id });
 	console.log('username : ', username)
	socket.broadcast.emit('newClient', { id : socket.id, username : username });
 })


  clientNbr++;
  io.emit('clientNbr', clientNbr);
  socket.on('pos',(pos) =>  socket.broadcast.emit('pos', pos));
  socket.on('obj',(obj) =>  socket.broadcast.emit('obj', obj));
  socket.on('mousePos',(pos) =>  socket.broadcast.emit('mousePos', pos));
  socket.on('disconnect', () => {
   clientNbr--; io.emit('clientNbr', clientNbr); 
   socket.broadcast.emit('otherDisconnect', socket.id);
	   for (var i = 0; i < mouses.length; i++) {
	   	console.log(mouses[i] + "vs " + socket.id);
	   	 if (mouses[i].id === socket.id) {
	   	 	mouses.splice(i, 1);
	   	 }	
	   }
	});
});



