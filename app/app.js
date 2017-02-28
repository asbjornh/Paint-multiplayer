var socket = io(),
	isTouch,
	isMouseDown = false,
	pixelRatio = window.devicePixelRatio,
	segmentLength = 4,
	smoothLength = 3,
	canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	currentDrawing = [],
	player = {
		name: "",
		viewport: {
			width: window.innerWidth,
			height: window.innerHeight
		}
	};


document.getElementById("creategame").addEventListener("click", function(){
	console.log("button clicked");
	socket.emit("creategame");
});

document.getElementById("join").addEventListener("click", function(){
	player.gamecode = document.getElementById("gamecode").value.toUpperCase();
	player.name = document.getElementById("playername").value;
	socket.emit("join", player);
});

document.getElementById("startgame").addEventListener("click", function(){
	socket.emit("startgame", player.gamecode);
});

socket.on("gamecreated", function(gamecode){
	console.log(gamecode);
	player.gamecode = gamecode;
	player.name = document.getElementById("playername").value;
	socket.emit("join", player);
});

socket.on("debug", function(msg){
	console.log("debug", msg);
});

socket.on("turnstart", function(page){
	console.log("turn start", page);
	player.page = page;
});

socket.on("turnend", function(){
	console.log("turn end");
	socket.emit("turnend", player.page.question);
});


try {  
	document.createEvent("TouchEvent");
	isTouch = true;
} catch (e) {
	isTouch = false;
}

function smoothPoints(ps) {
	var a = 0.2;
	var p = ps[ps.length - 1];
	var p1 = ps[ps.length - 2];
	ps[ps.length - 1] = {
		x: parseFloat( ((p.x * a + p1.x * (1 - a)) * pixelRatio).toFixed(2) ),
		y: parseFloat( ((p.y * a + p1.y * (1 - a)) * pixelRatio).toFixed(2) )
	};

	return ps;
};


function drawHandler(coords) {
	currentDrawing.push({
		x: coords.clientX,
		y: coords.clientY
	});

	if (currentDrawing.length > smoothLength)  { currentDrawing = smoothPoints(currentDrawing); }

	if (currentDrawing.length > segmentLength) {
		drawLine(currentDrawing.slice(-segmentLength));
	}
}



if (isTouch) {
	canvas.addEventListener("touchmove", function(e){
		e.preventDefault();
		drawHandler(e.touches[0]);
	});

	canvas.addEventListener("touchend", function(){
		player.paths.push(currentDrawing);
		currentDrawing = [];
	});
} else {
	canvas.addEventListener("mousedown", function(){ isMouseDown = true; });

	canvas.addEventListener("mousemove", function(e){
		if (isMouseDown) {
			drawHandler(e);
		}
	});

	canvas.addEventListener("mouseup", function(){
		isMouseDown = false;
		player.paths.push(currentDrawing);
		currentDrawing = [];
	});
}


// Draw
socket.on("userinput", function(data){
	drawPaths(data.paths);
});



// Canvas setup

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

function drawLine(points) {
	var p0 = points[0];
	ctx.fillStyle = "black";
	ctx.strokeWidth = pixelRatio;
	ctx.filter = "blur(1px)";
	ctx.beginPath();
	ctx.moveTo(p0.x, p0.y);

	for (var i = 1; i < points.length; ++i) {
		ctx.lineTo(points[i].x, points[i].y);
	}

	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawPaths(paths) {
	ctx.fillStyle = "whitesmoke";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	paths.forEach(function(path){
		var lineSegment = [];
		path.forEach(function(point){
			lineSegment.push(point);
			if (lineSegment.length > segmentLength) {
				drawLine(lineSegment.slice(-segmentLength));
			}
		});
	});
}




