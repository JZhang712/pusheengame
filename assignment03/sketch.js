// set graphics variables
let cat;
let catJump;
let jumpMode = false;
let jumpPower = 0;
let gravity = 0.25;

let carrot;
let donut;

let bg;
let bg1 = 0;
let bg2 = 900;

// audio variables
let coin;
let fail;

// game variables
let points = 0;
let gameState = 0;
// local storage for easy med and hard (high score)
if (localStorage.getItem('GamepointsEasy') == null) {
	localStorage.setItem('GamepointsEasy', points);
}
if (localStorage.getItem('GamepointsMed') == null) {
	localStorage.setItem('GamepointsMed', points);
}
if (localStorage.getItem('GamepointsHard') == null) {
	localStorage.setItem('GamepointsHard', points);
}

// make a player Pusheen
let playerP;

let gameSpeed;
let gameSpeedO;
let gameSpeedTemp;
let gameType;

// arrays for donuts and carrots
let donuts = [];
let carrots = [];

// load graphics
function preload() {

	cat = loadImage('assignment03_graphics/pusheen3.png');
	catJump = loadImage('assignment03_graphics/pusheen_jump.png');
	carrot = loadImage('assignment03_graphics/carrot.png');
	donut = loadImage('assignment03_graphics/donut.png');
	bg = loadImage('assignment03_graphics/background2.jpg');
	coin = loadSound('assignment03_graphics/coin.wav');
	fail = loadSound('assignment03_graphics/fail.wav');



}

function setup() {

	let theCanvas = createCanvas(900, 500);
	theCanvas.style('display', 'block');
	theCanvas.style('margin', 'auto');
	theCanvas.style('margin-top', '50px');

	playerP = new Pusheen(200, 380);

	imageMode(CENTER);
	while (carrots.length < 3) {
		let x = random(400, width*2);
		let y = random(200, 320);
		let bad = false;
		for (let i = 0; i < carrots.length; i++) {
			let tempd = dist(x, y, carrots[i].x, carrots[i].y);
			if (tempd < 200) {
				bad = true;
			}
		}
		if (bad == false) {
			let newCarrot = new Food(x, y, 3, carrot);
			carrots.push(newCarrot);
		}
	}

	while (donuts.length < 5) {
		let x = random(400, width*2);
		let y = random(200, 320);
		let bad = false;
		for (let i = 0; i < donuts.length; i++) {
			let tempd = dist(x, y, donuts[i].x, donuts[i].y);
			if (tempd < 200) {
				bad = true;
			}
		}
		if (bad == false) {
			let newDonut = new Food(x, y, 3, donut);
			donuts.push(newDonut);
		}
	}
	imageMode(CORNER);

	console.log(donuts);
	console.log(carrots);
}

function draw() {
	//let donuts = document.querySelector(".donutsHTML").value

	if (gameState == 0) {
		image(bg, bg1, 0);
		image(bg, bg2 , 0);

		bg1 -= 1;
		bg2 -= 1;

		if (bg1 <= -900) {
			bg1 = bg2 + 900;
		}
		if (bg2 <= -900) {
			bg2 = bg1 + 900;
		}

		fill(227, 227, 227)
		rect(200, 250, 70, 50);
		rect(400, 250, 70, 50);
		rect(600, 250, 70, 50);

		fill(0)
		textFont('monospace', 15);
		text("EASY", 220, 280);
		text("MEDIUM", 411, 280);
		text("HARD", 618, 280);
	}

	if (gameState == 1) {
		gameSpeed = gameSpeedO;
		//console.log(gameSpeed);

		// background scoll
		imageMode(CORNER);
		image(bg, bg1, 0);
		image(bg, bg2 , 0);

		bg1 -= 1;
		bg2 -= 1;

		if (bg1 <= -900) {
			bg1 = bg2 + 900;
		}
		if (bg2 <= -900) {
			bg2 = bg1 + 900;
		}

		// show points
		textFont('monospace');
		text("Points: " + points, 10, 15);

		// cat jump movement
		playerP.display();
		playerP.move();

		for (let i =0; i < donuts.length; i++){
			donuts[i].display();
			donuts[i].move(gameSpeed);
		}

		for (let i =0; i < carrots.length; i++){
			carrots[i].display();
			carrots[i].move(gameSpeed);
		}
	}

	if (gameState == 2) {
		gameSpeed = 0;
	}

	if (gameState == 3) {
		imageMode(CORNER);
		image(bg, bg1, 0);
		image(bg, bg2 , 0);

		bg1 -= 1;
		bg2 -= 1;

		if (bg1 <= -900) {
			bg1 = bg2 + 900;
		}
		if (bg2 <= -900) {
			bg2 = bg1 + 900;
		}

		fill(77, 121, 209);
		textSize(40);
		textFont('monospace');
		text("Game Over!", 330, 250);
		textSize(20);
		text("Points: " + points, 330, 300);
		if (gameType == 1) {
			text("High Score: " + localStorage.getItem('GamepointsEasy'), 330, 330);
		}
		if (gameType == 2) {
			text("High Score: " + localStorage.getItem('GamepointsMed'), 330, 330);
		}
		if (gameType == 3) {
			text("High Score: " + localStorage.getItem('GamepointsHard'), 330, 330);
		}

		// play again
		fill(250, 227, 157);
		rect(330, 340, 140, 30);
		fill(77, 121, 209)
		text("Play Again?", 330, 360);

	}

}

class Pusheen {
	constructor(x, y) {
		// commute our position to our object
		this.x = x;
		this.y = y;
		this.currentImage = cat;
		this.width = 50;
		this.height = 60;
	}

	display() {
		image(this.currentImage, this.x, this.y, this.width, this.height);
	}

	move() {
		if (keyIsDown(32) && jumpMode == false) {
			jumpMode = true;
			jumpPower -= 8.75;
		}
		if (jumpMode == true) {
			this.width = 90;
			this.height = 90;
			this.y += jumpPower;
			jumpPower += gravity;
			this.currentImage = catJump;
			
			if (this.y + 60 >= 440) {
				jumpMode = false;
				jumpPower = 0;
				this.currentImage = cat;
				this.width = 50;
				this.height = 60;
			}

		}
	}
}

class Food {
	constructor(x, y, speed, artwork) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.artwork = artwork;
		this.size = 50;
	}

	display() {
		image(this.artwork, this.x, this.y, this.size, this.size);
	}

	move(gameSpeed) {
		this.gameSpeed = gameSpeed;
		this.x -= this.gameSpeed;
		if (this.x < -40) {
			this.x = random(900,1100);
		}

		let d = dist(this.x+this.size/2, this.y+this.size/2, playerP.x+playerP.width/2, 
			playerP.y+playerP.height/2);
		if (d < 40) {
			if (this.artwork == donut) {
				points++;
				this.x = random(900,1100);
				if (coin.isPlaying() == false) {
					coin.play();
				}
			}
			else {
				if (fail.isPlaying() == false) {
					fail.play();
				}
				gameState = 3;
				// check and set high scores
				if (gameType == 1) {
					if (localStorage.getItem('GamepointsEasy') < points) {
						localStorage.setItem('GamepointsEasy', points);
					}
				}
				if (gameType == 2) {
					if (localStorage.getItem('GamepointsMed') < points) {
						localStorage.setItem('GamepointsMed', points);
					}
				}
				if (gameType == 3) {
					if (localStorage.getItem('GamepointsHard') < points) {
						localStorage.setItem('GamepointsHard', points);
					}
				}
			}
		}
	}
}

function mouseClicked() {
	if (gameState == 0) {
		//hard
		if (mouseX > 600 && mouseY > 250) {
			resetGame();
			points = 0;
			gameState = 1;
			gameSpeedO = 5;
			gameType = 3;

		}
		//med
		else if (mouseX > 400 && mouseY > 250) {
			resetGame();
			points = 0;
			gameState = 1;
			gameSpeedO = 3;
			gameType = 2;
		}
		//easy
		else if (mouseX > 200 && mouseY > 250) {
			resetGame();
			points = 0;
			gameState = 1;
			gameSpeedO = 2;
			gameType = 1;
		}
	}
	if (gameState == 3) {
		if (mouseX < 470 && mouseY < 370) {
			gameState = 0;
		}
	}
	
}

function resetGame() {
	carrots.splice(0, carrots.length);
	donuts.splice(0, donuts.length);
	while (carrots.length < 3) {
		let x = random(400, width*2);
		let y = random(200, 320);
		let bad = false;
		for (let i = 0; i < carrots.length; i++) {
			let tempd = dist(x, y, carrots[i].x, carrots[i].y);
			if (tempd < 200) {
				bad = true;
			}
		}
		if (bad == false) {
			let newCarrot = new Food(x, y, 3, carrot);
			carrots.push(newCarrot);
		}
	}

	while (donuts.length < 5) {
		let x = random(400, width*2);
		let y = random(200, 320);
		let bad = false;
		for (let i = 0; i < donuts.length; i++) {
			let tempd = dist(x, y, donuts[i].x, donuts[i].y);
			if (tempd < 200) {
				bad = true;
			}
		}
		if (bad == false) {
			let newDonut = new Food(x, y, 3, donut);
			donuts.push(newDonut);
		}
	}
}

function pauseGame() {
	gameState = 2;
}

function goGame() {
	gameState = 1;
}














