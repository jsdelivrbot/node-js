var cnv;
var players = [];
var balls = [];
var socket = io();
var bg = 255; 
var seconds = 5;
var gameStarted = false;

var user = undefined;
var otherUser = undefined;


socket.on('ballChange', (data) =>{
	balls[0].ySpeed = data.ySpeed;
})

socket.on('pos', (data) => {
	if (userNbr === 0) 
	players[1].y = data.y;
	
	if (userNbr === 1)
	players[0].y = data.y;	

})
socket.on('receiveUser', (user_) =>{
	user = user_;
})

socket.on('receiveOtherUser', (otherUser_) =>{
	otherUser = otherUser_;
	launchGame();
})

var userNbr = undefined;
socket.on('userNbr', (userNbr_) =>{
	userNbr = userNbr_;
})

socket.on('otherDisconnect', () => {
	alert("reloading...")
	location.reload();
})
 function search(){
 	 app.accueil = false;
 	 socket.emit('searching', user.id)
 }
 setInterval(()=> {
 	if (players[0] != undefined && players[0].height > 40) { 
 	players[1].height -= 1;
 	players[0].height -= 1;
 	}
 }, 1000);

 function restartGame(){
 	balls[0].x = width/2;
 	balls[0].y = height/2;

 	seconds = 3;
 	gameStarted = false;
	if (seconds != 0) { 
	var clr = setInterval(() => {
	 	seconds--;
	 	if (seconds === 0) {
	 		clearInterval(clr);
	 		gameStarted = true;
	 	}
	 }, 1000)	
	}  		
 }
 function launchGame(){
  textFont(font);
  bg = 0;
  cnv = createCanvas(800, 600);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);	

  balls.push(new Ball(width/2, height/2, 20, 20));

  players.push(new Player(0, height/2, 20, 120));
  players.push(new Player(width-20, height/2, 20, 120));
	if (seconds != 0) { 
	 var clr = setInterval(() => {
	 	seconds--;
	 	if (seconds === 0) {
	 		clearInterval(clr);
	 		gameStarted = true;
	 	}
	 }, 500)	
	}  
}
var font;
function preload(){
	font = loadFont("pixel.ttf");
}
function setup(){

 }

function windowResized(){
  if (seconds <= 0) {
	  var x = (windowWidth - width) / 2;
	  var y = (windowHeight - height) / 2;
	  cnv.position(x, y);
	}
}
function draw(){
 	background(bg);
	if (gameStarted) {
		stroke(255);
		text(int(players[0].x) + " " + int(players[0].y) + " 			" + int(balls[0].x) + " " + int(balls[0].y) + " 		" + int(players[1].x) + "  " + int(players[1].y) ,400, 400);
		line(width/2, 0, width/2, height);
		textSize(60);
		text(players[0].score + "               " + players[1].score, width/2, 200);
		textSize(20);
		//text("fps :" + int(frameRate()), 150, 150);
		for (var i = 0; i < players.length; i++) {
			players[i].show();
			if (i === userNbr) { 
		 		players[i].move();
		 		socket.emit("pos", { x : players[i].x, y : players[i].y, otherUser : otherUser });
		  }
		}

		for (var i = 0; i < balls.length; i++) {
			balls[i].show();
			balls[i].move();
	 		balls[i].collide();
		}
	} else {
		fill(255);
		textSize(40);
		textAlign(CENTER);
		text("Game start in " + seconds, width/2, height/2);
	}

 

}


class Player{

	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.score = 0;
	}

	move(){
		this.y = mouseY;
	}

	show(){
		fill(255);
		rect(this.x, this.y, this.width, this.height);
	}

}

class Ball{

	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.xSpeed = 5;
		this.ySpeed = 0;
		this.canCollide = true;
	}

	show(){
		ellipse(this.x, this.y, this.width, this.height);
	}

	move(){
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}

	collide(){
		if (this.y < 0 || this.y > height ) {
			this.ySpeed = -this.ySpeed;
		}

		if (this.x < 0) {
			players[1].score++;
			restartGame();
		} else if (this.x > width) {
			players[0].score++;
			restartGame();
		}
		for (var j = 0; j < players.length; j++) {
			stroke(255);
			line(this.x, this.y, players[j].x+players[j].width/2, players[j].y+players[j].height/2);
			if (collideRectCircle(players[j].x,	players[j].y,  players[j].width, players[j].height, this.x, this.y, this.width, this.height) && this.canCollide) {
 				this.xSpeed = -this.xSpeed;
 				console.log(userNbr)
 				if (j === userNbr) { 
	 				var ySpeedTemp = random(-10, 10);
	 				this.ySpeed = ySpeedTemp;
	 				print("sended.")
	 			    socket.emit("ballChange", { toId : otherUser.id, ySpeed : ySpeedTemp });
				}
				this.canCollide = false;
				setTimeout( () => {
					this.canCollide = true;
				}, 500);
			}
		}		
	}

}