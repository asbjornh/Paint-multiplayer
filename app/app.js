var socket = io(),
	isTouch,
	isMouseDown = false,
	segmentLength = 4,
	smoothLength = 3,
	thisPoints = [],
	canvas = document.getElementById("canvas"),
	data = {
		box: {
			width: window.innerWidth,
			height: window.innerHeight
		},
		points: [],
		color: "black"
	};


// Communication
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
		x: p.x * a + p1.x * (1 - a),
		y: p.y * a + p1.y * (1 - a)
	};

	return ps;
};


function processCoords(coords) {
	data.points.push({
		x: coords.clientX,
		y: coords.clientY
	});

	if (data.points.length > smoothLength)  { data.points = smoothPoints(data.points); }
	if (data.points.length > segmentLength) { data.points = data.points.slice(1); }

	drawLine(data.points.map(function(p){
		return { x: p.x * window.devicePixelRatio, y: p.y * window.devicePixelRatio };
	}), data.color);
	
	socket.emit("userinput", data);
}

if (isTouch) {
	canvas.addEventListener("touchend", function(){
		data.points = [];
		thisPoints = [];
	});

	canvas.addEventListener("touchmove", function(e){
		e.preventDefault();
		processCoords(e.touches[0]);
	});
} else {
	canvas.addEventListener("mousedown", function(){ isMouseDown = true; });

	canvas.addEventListener("mouseup", function(){
		isMouseDown = false;
		data.points = [];
		thisPoints = [];
	});

	canvas.addEventListener("mousemove", function(e){
		if (isMouseDown) {
			processCoords(e);
		}
	});
}


// Draw
socket.on("userinput", function(data){
	drawLine(data.points, data.color);
});



// Canvas setup
var	ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

function drawLine(points, color) {
	var p0 = points[0];
	ctx.fillStyle = color;
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




