var displayArea = {
	canvas : document.getElementById("canvas"),
	start : function() {
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		this.context = this.canvas.getContext("2d");
		// document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		// this.interval = setInterval(updateGameArea, 20);
		// updateGameArea();
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	grid : function() {
		// draw lines on grid
		for (var i = 0; i < canvasWidth + pieceSize; i += pieceSize) {
			this.context.beginPath();
			this.context.moveTo(i,0);
			this.context.lineTo(i,canvasHeight);
			this.context.stroke();
		}
		for (var j = 0; j < canvasHeight + pieceSize; j += pieceSize) {
			this.context.beginPath();
			this.context.moveTo(0,j);
			this.context.lineTo(canvasWidth,j);
			this.context.stroke();
		}
	}
}

