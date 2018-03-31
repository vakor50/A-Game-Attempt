		class Player {
			constructor() {
				this.x = 1;
				this.y = 1;
			}
		}

		var p = new Player();
		var m = new Player();


///////////////////////////////////////////////////////////

		var board = new Array(canvasHeight / pieceSize);
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

		function setBoard() {
			clearBoard();
			setPiece(p.x, p.y, "player")
			moveMonster(m)
			setPiece(m.x, m.y, "monster")
			logBoard();

		}

		function initBoard() {
			clearBoard();
			setPiece(p.x, p.y, "player")
			m.x = Math.floor( Math.random() * ((canvasWidth / pieceSize)/2 - 1) + (canvasWidth / pieceSize)/2)
			m.y = Math.floor( Math.random() * ((canvasHeight / pieceSize) - 2) + 1)
			console.log(m.x)
			console.log(m.y)
			setPiece(m.x, m.y, "monster")
			logBoard();
			console.log(board)
		}



///////////////////////////////////////////////////////////
// Player Functions
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

		$(document).ready(function () {
			initBoard();
		});
			$('body').keyup(function( event ) {
				// 
			}).keydown(function( event ) {
				if ( event.which == 87 ) {
					// up
					if (isOpenPos(p.x, p.y-1)) {
						p.y -= 1
					}
					console.log("up")
					setBoard();
				} else if ( event.which == 83 ) {
					// down
					if (isOpenPos(p.x, p.y+1)) {
						p.y += 1
					}
					console.log("down")
					setBoard();
				} else if ( event.which == 65 ) {
					// left
					if (isOpenPos(p.x-1, p.y)) {
						p.x -= 1
					}
					console.log("left")
					setBoard();
				} else if ( event.which == 68 ) {
					// right
					if (isOpenPos(p.x+1, p.y)) {
						p.x += 1
					}
					console.log("right")
					setBoard();
				}
			});

// Monster Functions
		function isPlayer(x, y) {
			// console.log(x + " / " + ((canvasWidth / pieceSize)-1))
			// console.log(y + " / " + ((canvasHeight / pieceSize)-1))
			if (x < 1 || x > (canvasWidth / pieceSize)-1) {
				return false;
			}
			if (y < 1 || y > (canvasHeight / pieceSize)-1) {
				return false;
			}
			// console.log(board)
			switch(board[y][x]) {
				case 3: // Wall
					return false;
				case 2: // Monster
					return false;
				case 1: // Player
					return true;
				case 0: // Empty
					return false;
				default:
					return false;
			}
		}

		function searchAround(radius, creature) {
			var nearby = [];
			for (var i = -radius; i < radius; i++) {
				for (var j = -radius; j < radius; j++) {
					// console.log((creature.x+i) + " , " + (creature.y+j))
					if (isPlayer(creature.x+i,creature.y+j)) {
						console.log((creature.x+i) + " , " + (creature.y+j))
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