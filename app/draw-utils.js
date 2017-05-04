
var pixelRatio = window.devicePixelRatio;

class DrawUtils {
	static isTouch() {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	}

	static smoothPoints(ps) {
		var a = 0.2;
		var p = ps[ps.length - 1];
		var p1 = ps[ps.length - 2];
		ps[ps.length - 1] = {
			x: parseFloat( ((p.x * a + p1.x * (1 - a)) * pixelRatio).toFixed(2) ),
			y: parseFloat( ((p.y * a + p1.y * (1 - a)) * pixelRatio).toFixed(2) )
		};

		return ps;
	}

	static drawLine(ctx, points) {
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

	static drawPaths(ctx, segmentLength, paths) {
		paths.forEach(function (path) {
			var lineSegment = [];
			path.forEach(function (point) {
				lineSegment.push(point);
				if (lineSegment.length > segmentLength) {
					this.drawLine(ctx, lineSegment.slice(-segmentLength));
				}
			});
		});
	}
}

export default DrawUtils;