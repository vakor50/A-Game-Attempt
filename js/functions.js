class Creature {
	constructor(x, y, name, type, health, armor, attack, damage) {
		this.x = x;
		this.y = y;
		this.name = name;
		this.type = type;
		this.health = health;
		this.armor = armor;
		this.attack = attack;
		this.damage = damage;
	}
	logPrint() {
		console.log(this.name + "(" + this.type + "): " + this.health + "hp. @ (" + this.x + ", " + this.y + ")");
		console.log("AC: " + this.armor + ", +" + this.attack + " to hit, +" + this.damage + " damage")
	}
}

var p = new Creature(1,1,"Player",1,10,10,2,2);

var numMonsters = 1;
var monsters = [];

///////////////////////////////////////////////////////////

var board = new Array(canvasHeight / pieceSize);

// reset board to empty
function clearBoard () {
	board = new Array(canvasHeight / pieceSize);

	for (var i = 0; i < board.length; i += 1) {
		board[i] = new Array(canvasWidth / pieceSize)

		for (var j = 0; j < board[i].length; j += 1) {
			board[i][j] = 0;
		}
	}
	addBoardBorder()
}

// create a wall around the edges of the board
function addBoardBorder() {
	for (var i = 0; i < board.length; i += 1) {
		for (var j = 0; j < board[i].length; j += 1) {
			if (i == 0 || i == board.length - 1) {
				board[i][j] = 3
			} else if (j == 0 || j == board[i].length - 1) {
				board[i][j] = 3
			}
		}
	}
}

// print the board into the console
function logBoard () {
	var str = ""
	for (var i = 0; i < board.length; i += 1) {
		for (var j = 0; j < board[i].length; j += 1) {
			var temp = '';
			switch (board[i][j]) {
				case 0:
					temp = '.';
					break;
				case 1:
					temp = '@';
					break;
				case 2:
					temp = 'O';
					break;
				case 3:
					temp = '#';
					break;
			}
			str += temp + " ";
		}
		str += "\n"
	}
	console.log(str)
}

// set the board value depending on the type
function setPiece(x, y, type) {
	switch (type) {
		case "player":
			board[y][x] = 1
			break;
		case "monster":
			board[y][x] = 2
			break;
		default:
			board[y][x] = 0
			break;
	}
}

// set all pieces on the board
function setBoard() {
	clearBoard();
	setPiece(p.x, p.y, "player")
	p.logPrint();
	for (var i = 0; i < monsters.length; i++) {
		moveMonster(monsters[i])
		setPiece(monsters[i].x, monsters[i].y, "monster")
		monsters[i].logPrint();
	}
	
	logBoard();
	convertToCanvas();
}

// initialize all pieces on the board
function initBoard() {
	clearBoard();

	setPiece(p.x, p.y, "player")

	for (var i = 0; i < numMonsters; i++) {
		var mx = Math.floor( Math.random() * ((canvasWidth / pieceSize)/2 - 1) + (canvasWidth / pieceSize)/2)
		var my = Math.floor( Math.random() * ((canvasHeight / pieceSize) - 2) + 1)
		var mh = 10; // health
		var mac = 10; // armor
		var matk = 2; // attack
		var mdmg = 2; // damage
		var m = new Creature(mx, my, "monster" + i, 2, mh, mac, matk, mdmg);
		monsters.push(m);
		setPiece(m.x, m.y, "monster")
	}

	logBoard();
	convertToCanvas();
}



///////////////////////////////////////////////////////////
// Player Functions
// check if the coordinates in the board are open
function isOpenPos(x, y) {
	if (x < 0 && x >= canvasWidth / pieceSize) {
		return false;
	}
	if (y < 0 && y >= canvasHeight / pieceSize) {
		return false;
	}

	switch(board[y][x]) {
		case 3: // Wall
			return false;
		case 2: // Monster
			return false;
		case 1: // Player
			return false;
		case 0: // Empty
			return true;
	}
}

function handleAttack() {
	// check around player for monster
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			// if a spot has a monster
			if (isCreature(p.x+i, p.y+j, 2)) {
				console.log("found creature")
				for (var k = 0; k < monsters.length; k++) {
					// attack the first monster next to player
					if (monsters[k].x == p.x+i && monsters[k].y == p.y+j) {
						monsters[k].health -= p.damage;
						// if monster health drops below 0, delete it.
						if (monsters[k].health <= 0) {
							monsters.splice(k, 1)
						}
						return;
					}
				}
			}
		}
	}
}


// set the board as user presses keys
$('body').keyup(function( event ) {
	// 
}).keydown(function( event ) {
	if ( event.which == 87 ) { // W
		// up
		if (isOpenPos(p.x, p.y-1)) {
			p.y -= 1
		}
		console.log("up")
		setBoard();
	} else if ( event.which == 83 ) { // S
		// down
		if (isOpenPos(p.x, p.y+1)) {
			p.y += 1
		}
		console.log("down")
		setBoard();
	} else if ( event.which == 65 ) { // A
		// left
		if (isOpenPos(p.x-1, p.y)) {
			p.x -= 1
		}
		console.log("left")
		setBoard();
	} else if ( event.which == 68 ) { // D
		// right
		if (isOpenPos(p.x+1, p.y)) {
			p.x += 1
		}
		console.log("right")
		setBoard();
	} else if ( event.which == 32 ) { // Space
		// player makes attack
		handleAttack();
		console.log("attack")
		setBoard();
	} else if ( event.which == 73 ) { // I
		// 
	} else if ( event.which == 79 ) { // O
		// 
	} else if ( event.which == 80 ) { // P
		// 
	} else if ( event.which == 77 ) { // M
		// open menu
	} 

	else {
		console.log(event.which)
	}
});

///////////////////////////////////////////////////////////
// Monster Functions
// check if there is a player in the area
function isCreature(x, y, type) {
	// console.log(x + " / " + ((canvasWidth / pieceSize)-1))
	// console.log(y + " / " + ((canvasHeight / pieceSize)-1))
	if (x < 1 || x > (canvasWidth / pieceSize)-1) {
		return false;
	}
	if (y < 1 || y > (canvasHeight / pieceSize)-1) {
		return false;
	}

	if (board[y][x] == type) {
		return true;
	} else {
		return false;
	}
		// case 3: // Wall
		// case 2: // Monster
		// case 1: // Player
		// case 0: // Empty
}

// search the radius of creature to look for a player
function searchAround(radius, creature) {
	var nearby = [];
	for (var i = -radius; i < radius; i++) {
		for (var j = -radius; j < radius; j++) {
			// console.log((creature.x+i) + " , " + (creature.y+j))
			if (isCreature(creature.x+i, creature.y+j, 1)) {
				// console.log((creature.x+i) + " , " + (creature.y+j))
				nearby.push({
					"x": creature.x+i, 
					"y": creature.y+j,
					"type": board[creature.y+j][creature.x+i]
				})
			}
		}
	}
	return nearby;
}

// update the source's coordinates to move it towards the target
function moveTowards(source, target) {
	var end = source;
	if (source[0] < target[0] && isOpenPos(source[0]+1, source[1])) {
		end[0] += 1;
	} else if (source[0] > target[0] && isOpenPos(source[0]-1, source[1])) {
		end[0] -= 1;
	} else if (source[1] < target[1] && isOpenPos(source[0], source[1]+1)) {
		end[1] += 1;
	} else if (source[1] > target[1] && isOpenPos(source[0], source[1]-1)) {
		end[1] -= 1;
	} else {

	}

	return end;
}

// perform movement towards player, otherwise move randomly
function moveMonster(creature) {
	var search = searchAround(4, creature);
	var hasMoved = false;
	for (var i = 0; i < search.length; i++) {
		if (search[i].type == 1) {
			var end = moveTowards([creature.x, creature.y], [search[i].x,search[i].y])
			creature.x = end[0];
			creature.y = end[1];
			hasMoved = true;
			return;
		}
	}
	if (!hasMoved) {
		// if no target, move randomly
		var end = [creature.x, creature.y]
		var upDownOrLeftRight = Math.floor( (Math.random() * 2) + 1)
		if (upDownOrLeftRight == 1) {
			var upDown = Math.floor( (Math.random() * 2) + 1)
			if (upDown == 1 && isOpenPos(end[0], end[1]+1)) {
				end[1] += 1
			} else if (isOpenPos(end[0], end[1]-1)) {
				end[1] -= 1;
			}
		} else {
			var leftRight = Math.floor( (Math.random() * 2) + 1)
			if (leftRight == 1 && isOpenPos(end[0]+1, end[1])) {
				end[0] += 1
			} else if (isOpenPos(end[0]-1, end[1])) {
				end[0] -= 1;
			}
		}

		creature.x = end[0];
		creature.y = end[1];
	}
}


///////////////////////////////////////////////////////////

function convertToCanvas() {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			switch ( board[i][j] ) {
				case 0: // blank
					ctx = displayArea.context;
					ctx.fillStyle = "white"
					ctx.fillRect(j*30, i*30, pieceSize, pieceSize); // x, y, width, height
					break;
				case 1: // player
					ctx = displayArea.context;
					ctx.fillStyle = "red"
					ctx.fillRect(j*30, i*30, pieceSize, pieceSize); // x, y, width, height
					break;
				case 2: // monster
					ctx = displayArea.context;
					ctx.fillStyle = "green"
					ctx.fillRect(j*30, i*30, pieceSize, pieceSize); // x, y, width, height
					break;
				case 3: // wall
					ctx = displayArea.context;
					ctx.fillStyle = "black"
					ctx.fillRect(j*30, i*30, pieceSize, pieceSize); // x, y, width, height
					break;
				case 4:
					ctx = displayArea.context;
					ctx.fillStyle = "blue"
					ctx.fillRect(j*30, i*30, pieceSize, pieceSize); // x, y, width, height
					break;
				default:
					ctx = displayArea.context;
					ctx.fillStyle = 
					ctx.fillRect(j*30, i*30, pieceSize, pieceSize); // x, y, width, height
					break;
			}
		}
	}
	displayArea.grid()
}



$(document).ready(function () {
	displayArea.start();
	displayArea.clear();
	initBoard();
})