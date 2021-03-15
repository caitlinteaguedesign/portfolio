// ===================
// THE GAME

var canvas;
var canvasContext;

// ball
const BALL_SIZE = 10;
var ballX = 400;
var ballSpeedX = (Math.random() > .5) ? 10 : -10;
var ballY = 250;
var ballSpeedY = (Math.random() > .5) ? 6 : -6;

// paddles
const PADDLE_WIDTH  = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_Y = 250;

var paddle1Y = PADDLE_Y;
var paddle2Y = PADDLE_Y;

// score
var player1score = 0;
var player2score = 0;

const WINNING_SCORE = 5;

// game state
var startScreen = true;
var winScreen = false;


// ---------------------------------------
// visual

// make a rectangle
function makeRectangle(X, Y, w, h, color)
{
	canvasContext.fillStyle = color;
	canvasContext.fillRect(X, Y, w, h);
}

// make a circle
function makeCircle(X, Y, radius, color)
{
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	// X Y of center, radius, angles & radions, clockwise or counterclockwise
	canvasContext.arc(X, Y, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

// positions an element in the center
function centerObject($w, $h) 
{
	var width_offset = $w/2;
	var height_offset = $h/2;

	var horiz_position = canvas.width/2 - width_offset;
	var vertical_position = canvas.height/2 - height_offset;

	return canvasContext.fillRect(horiz_position, vertical_position, $w, $h);
}

// decoration in the middle of the playfield
function drawNet() 
{
	for(var i = 0; i < canvas.height; i+=25)
	{
		makeRectangle(canvas.width/2-1, i+5, 2, 17, '#2d4655');
	}
}

// make the things
function drawEverything()
{
	makeRectangle(0, 0, canvas.width, canvas.height, '#172731');

	if(startScreen) 
	{
		canvasContext.textAlign = "center"; 
		
		// winner text 
		var text;
		canvasContext.fillStyle = 'white';
		canvasContext.font = "1.75em Open Sans";

		text = "Want to play a game?";
		canvasContext.fillText(text, canvas.width/2, 190);

		text = "Use the mouse to move your paddle up and down";
		canvasContext.fillStyle = '#829bab';
		canvasContext.font = "1.125em Open Sans";
		canvasContext.fillText(text, canvas.width/2, 230);

		// button values
		text = "Start";
		textWidth = (canvasContext.measureText(text).width+40);

		// button shape
		canvasContext.strokeStyle = '#2d4655';
		canvasContext.strokeRect(canvas.width/2-(textWidth/2), 270, textWidth, 60);

		// button text styles
		canvasContext.font = "1.125em Open Sans";
		canvasContext.fillStyle = '#6e95ad';

		// button text
		canvasContext.fillText(text, canvas.width/2, 305);

		return;
	}

	if(winScreen) 
	{
	
		canvasContext.textAlign = "center"; 
		
		// winner text 
		var text;
		canvasContext.fillStyle = 'white';
		canvasContext.font = "1.75em Open Sans";

		if(player1score >= WINNING_SCORE)
		{
			text = "Hooray! Good job [human].";
			
		}
		else {
			text = "Oh noes! The robots are winning.";
		}

		canvasContext.fillText(text, canvas.width/2, 220);

		// button values
		text = "Click to play again";
		textWidth = (canvasContext.measureText(text).width);
		// button shape
		canvasContext.strokeStyle = '#2d4655';
		canvasContext.strokeRect(canvas.width/2-(textWidth/2), 250, textWidth, 60);
		// button text styles
		canvasContext.font = "1.125em Open Sans";
		canvasContext.fillStyle = '#6e95ad';
		// button text
		canvasContext.fillText(text, canvas.width/2, 285);

		return;
	}

	// spawn point
	canvasContext.fillStyle = '#0e1a22';
	centerObject(30,30);

	// net
	drawNet();

	// paddles
	// left paddle (player)
	makeRectangle(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, '#2ba3b9');

	// right paddle (computer)
	makeRectangle(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, '#2ba3b9');

	// score board
	const margin = 15;
	const boardW = 85;
	const boardH = 68;

	makeRectangle(margin, margin, boardW, boardH, '#070e13');
	makeRectangle(canvas.width-(boardW+margin), margin, boardW, boardH, '#070e13');

	canvasContext.textAlign = "left"; 
	canvasContext.font = "1.25em Rajdhani";
	canvasContext.fillStyle = '#6e9dbe';
	canvasContext.fillText("Player 1", 25, 40)
	canvasContext.fillText("Player 2", canvas.width-(boardW+margin-10), 40)

	// scores
	canvasContext.font = "700 1.125em Open Sans";
	canvasContext.fillStyle = 'white';
	canvasContext.fillText(player1score, 25, 70)
	canvasContext.fillText(player2score, canvas.width-(boardW+margin-10), 70)

	// ball
	makeCircle(ballX, ballY, BALL_SIZE, "orange");
}

// ----------------------------
// logic

function computerMovement() 
{
	var offset = PADDLE_HEIGHT/2;
	var paddle2YCenter = paddle2Y + offset;

	if(paddle2YCenter < ballY)
	{
		paddle2Y += 6;
	}
	else if (paddle2Y > ballY) {
		paddle2Y -= 6;
	}
}

// controls the ball's movement
function moveEverything()
{	
	if(winScreen || startScreen) {
		return;
	}

	// AI
	computerMovement();

	// the ball's horizontal speed
	ballX += ballSpeedX;

	// right edge/computer paddle
	if(ballX > canvas.width - BALL_SIZE*2) 
	{
		if(ballY > paddle2Y &&
			ballY < paddle2Y+PADDLE_HEIGHT)
		{
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * .35;
		}
		else 
		{
			if(ballX > canvas.width)
			{
				player1score++;
				ballReset(false);
			}
		}
	}
	// left edge/player
	if(ballX < BALL_SIZE*2)
	{
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT)
		{
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * .35;
		}
		else 
		{
			if(ballX < 0)
			{
				player2score++;
				ballReset(true);
			}
		}
	}

	// the ball's vertical speed
	ballY += ballSpeedY;
 	// when it encounters the bottom
	if(ballY > canvas.height - BALL_SIZE) 
	{
		ballSpeedY = -ballSpeedY;
	}
	// when it encounters the top
	if(ballY < BALL_SIZE)
	{
		ballSpeedY = -ballSpeedY; // alt: Math.abs(ballSpeedX)
	}
}

// transfer the mouse position to where the paddle should be
function calculateMousePos(e)
{
	var boundry = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = e.clientX - boundry.left - root.scrollLeft;
	var mouseY = e.clientY - boundry.top - root.scrollTop;

	// check offsets to create a top and bottom boundry for paddle
	var offset = PADDLE_HEIGHT/2;

	// solution if want to keep paddle on screen
	if(mouseY < offset) mouseY = offset;
	if(mouseY > canvas.height-offset) mouseY = canvas.height-offset;

	return {
		x: mouseX,
		y: mouseY
	};
}

// reset the ball when the paddles miss
function ballReset(player)
{
	if(player1score >= WINNING_SCORE ||
		player2score >= WINNING_SCORE)
	{
		winScreen = true;
	}

	// pass the puck toward the player that just scored
	if(player) ballSpeedX = 10;
	else ballSpeedX = -10;

	var randomY = Math.random();

	if(randomY > .5) ballSpeedY = 5;
	else ballSpeedY = -5;

	ballX = canvas.width/2 - BALL_SIZE;
	ballY = canvas.height/2 - BALL_SIZE;

}

function handleMouseClick(e)
{
	if(winScreen) 
	{
		player1score = 0;
		player2score = 0;

		winScreen = false;
	}

	if(startScreen) 
	{
		startScreen = false;
	}
}

// initialize and run the things!
window.onload = function() 
{
	// defining things
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	// the start of the game build
	drawEverything();

	// doing things
	var frames = 30;

	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/frames); // frames per second

	// click to close win screen and start a new game
	canvas.addEventListener('mousedown', handleMouseClick);

	// player paddle movement
	canvas.addEventListener('mousemove',
		function(e) {
			var mousePos = calculateMousePos(e);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2); // adjust for height of paddle
		});
}