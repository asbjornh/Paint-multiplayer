var socket = io(),
	isTouch,
	isMouseDown = false,
	segmentLength = 4,
	smoothLength = 4,
	data = {
		box: {
			width: window.innerWidth,
			height: window.innerHeight
		},
		points: []
	};


// Communication
try {  
	document.createEvent("TouchEvent");
	isTouch = true;
} catch (e) {
	isTouch = false;
}

function sendData(coords) {
	data.points.push({
		x: coords.clientX,
		y: coords.clientY
	});

	if (data.points.length > segmentLength) { data.points = data.points.slice(1); }

	socket.emit("userinput", data);
}

if (isTouch) {
	document.addEventListener("touchend", function(){ data.points = []; });

	document.addEventListener("touchmove", function(e){
		sendData(e.touches[0]);
	});
} else {
	document.addEventListener("mousedown", function(){ isMouseDown = true; });

	document.addEventListener("mouseup", function(){
		isMouseDown = false;
		data.points = []; // Reset points
	});

	document.addEventListener("mousemove", function(e){
		if (isMouseDown) {
			sendData(e);
		}
	});
}



// Canvas setup
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawLine(points) {
	var p0 = points[0];
	ctx.fillStyle = "black";
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

function smooth(ps) {
	var a = 0.2;
	var p = ps[ps.length - 1];
	var p1 = ps[ps.length - 2];
	ps[ps.length - 1] = {
		x: p.x * a + p1.x * (1 - a),
		y: p.y * a + p1.y * (1 - a)
	};

	return ps;
};



// Draw
socket.on("userinput", function(data){
	if (data.points.length >= smoothLength) {
		drawLine(smooth(data.points));
	}
});









