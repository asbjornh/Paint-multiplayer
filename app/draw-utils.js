
var smoothLength = 3;

class DrawUtils {
	static smoothPoints(points, pixelRatio) {
		if (points.length >= smoothLength) {
			var a = 0.2;
			var p = points[points.length - 1];
			var p1 = points[points.length - 2];
			points[points.length - 1] = {
				x: parseFloat( ((p.x * a + p1.x * (1 - a)) * pixelRatio).toFixed(2) ),
				y: parseFloat( ((p.y * a + p1.y * (1 - a)) * pixelRatio).toFixed(2) )
			};
		}

		return points;
	}

	static drawLine(ctx, points, pixelRatio) {
		var p0 = points[0];
		ctx.fillStyle = "black";
		ctx.strokeWidth = 2 * pixelRatio;
		ctx.filter = "blur(1px)";
		ctx.beginPath();
		ctx.moveTo(p0.x, p0.y);

		for (var i = 1; i < points.length; ++i) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.stroke();
	}

	static drawPaths(ctx, paths, pixelRatio) {
		paths.forEach(function (path) {
			path.forEach(function (point, i) {
				var partialPath = path.slice(0, Math.max(1, i));
				DrawUtils.drawLine(ctx, partialPath, pixelRatio);
			})
		});
	}
}

export default DrawUtils;