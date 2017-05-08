var smoothLength = 3;

class DrawUtils {
	static smoothPoints(points) {
		if (points.length >= smoothLength) {
			var a = 0.2;
			var p = points[points.length - 1];
			var p1 = points[points.length - 2];
			points[points.length - 1] = {
				x: parseFloat( (p.x * a + p1.x * (1 - a)).toFixed(2) ),
				y: parseFloat( (p.y * a + p1.y * (1 - a)).toFixed(2) )
			};
		}

		return points;
	}


	static clearCanvas(canvas) {
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	}


	static transferImage(canvasIn, canvasOut) {
		var ctx = canvasOut.getContext("2d");
		ctx.globalCompositeOperation = "multiply";
		ctx.drawImage(canvasIn, 0, 0);
	}


	static drawLine(canvas, points, pixelRatio) {
		var p0 = points[0],
			ctx = canvas.getContext("2d");

		ctx.strokeStyle = "black";
		ctx.lineWidth = 3 * pixelRatio;
		ctx.lineCap = "round";

		ctx.beginPath();
		ctx.moveTo(p0.x, p0.y);

		for (var i = 1; i < points.length; ++i) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.stroke();
	}

	static drawPaths(canvas, paths, pixelRatio) {
		paths.forEach(function (path) {
			DrawUtils.drawLine(canvas, path, pixelRatio);
		});
	}
}

export default DrawUtils;