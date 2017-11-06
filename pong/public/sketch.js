var cnv;
var players = [];
var balls = [];
var socket = io();
var bg = 255; 
var seconds = 5;
var gameStarted = false;

var user = undefined;
var otherUser = undefined
socket.on('receiveUser', (user_) =>{
	user = user_;
})

socket.on('receiveOtherUser', (otherUser_) =>{
	otherUser = otherUser_;
})

socket.on('otherDisconnect', () => {
	alert("reloading...")
	location.reload();
})
 function search(){
 	 socket.emit('searching', user.id)
 	 alert();
 }

 function launchGame(){
  bg = 0;
  cnv = createCanvas(800, 600);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);	

  balls.push(new Ball(width/2, height/2, 40, 40));
  players.push(new Player(40, height/2, 20, 120));
  players.push(new Player(width-60, height/2, 20, 120));

	if (seconds != 0) { 
	 setInterval(() => {
	 	seconds--;
	 	if (seconds === 0) {
	 		gameStarted = true;
	 	}
	 }, 500)	
	}  
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
		for (var i = 0; i < players.length; i++) {
			players[i].show();
		 	players[i].move();
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


		for (var j = 0; j < players.length; j++) {
			stroke(255);
			line(this.x, this.y, players[j].x+players[j].width/2, players[j].y+players[j].height/2);
			if (collideRectCircle(players[j].x,	players[j].y,  players[j].width, players[j].height, this.x, this.y, this.width, this.height) && this.canCollide) {
 				this.xSpeed = -this.xSpeed;
			 	this.ySpeed = random(-10, 10);
				this.canCollide = false;
				setTimeout( () => {
					this.canCollide = true;
				}, 500);
			}
		}		
	}

}