// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000);  

function random(min, max){
 return Math.floor(Math.random() * (max - min)) + min;
}
 
console.log("localhost:3000 started ")

 

// ------- PONG ------------
class User{ 
	constructor(id_) {
		this.id = id_;
		this.searching = false;
		this.otherId = undefined;
	}

	search(){
		// useless
		for (var i = 0; i < users.length; i++) {
			if (users[i].id != this.id && users[i].searching && this.searching) {
				users[i].searching = false;
				this.searching = false;
				
				users[i].otherId = this.id;
				this.id = users[i].otherId;
				
				console.log(users[i].id + " and " + this.id + " found"); 
			}
		}
	}
}
 
var users = [];

setInterval(()=> {
	console.log(users);
  	for (var i = 0; i < users.length; i++) {
  	 	for (var j = 0; j < users.length; j++) {
  	 		if (users[i].id != users[j].id && users[i].searching && users[j].searching) {
  	 			users[i].searching = false;
  	 			users[j].searching = false;

  	 	        users[i].otherId = users[j].id;
				users[j].otherId = users[i].id;

  	 			io.to(users[i].id).emit('receiveOtherUser', users[j]);
  	 			io.to(users[j].id).emit('receiveOtherUser', users[i]);

  	 		}
  	 	}
  	 }
 	


}, 1000)
io.on('connection', (socket) => {
 var user = new User(socket.id);
 users.push(user);
 socket.emit('receiveUser', user)

  socket.on('disconnect',  () =>  {
 		for (var i = 0; i < users.length; i++) {
 			if (socket.id === users[i].id){	
 					for (var j = 0; j < users.length; j++) {
 						console.log(users[j].otherId  + " === " + socket.id);
 						if (users[j].otherId === socket.id) {
 							console.log(users[j].id + " sendend emit");
 							socket.broadcast.to(users[j].id).emit('otherDisconnect');
 						}
 					}

				console.log(users[i].id + "disconnect"); 					
 				users.splice(i, 1);
 			}
 		}
 	});

  socket.on('searching', (id) => {
  	for (var i = 0; i < users.length; i++) {
  		if (users[i].id === id) {
  			users[i].searching = true;
  		}
  	}
  })
 
})


