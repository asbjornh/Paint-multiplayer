import React from "react";
import PropTypes from "prop-types";

import DrawUtils from "../draw-utils";


const segmentLength = 4,
	smoothLength = 3;

class Draw extends React.Component {
	static propTypes = {
		question: PropTypes.string,
		updateAnswer: PropTypes.func
	}

	state = {
		isMouseDown: false
	}

	currentLine = []
	paths = []

	drawHandler(coords) {
		this.currentLine.push({
			x: coords.clientX,
			y: coords.clientY
		});

		if (this.currentLine.length > smoothLength) {
			this.currentLine = DrawUtils.smoothPoints(this.currentLine);
		}

		if (this.currentLine.length > segmentLength) {
			DrawUtils.drawLine(this.ctx, this.currentLine.slice(-segmentLength));
		}
	}

	componentDidMount() {
		this.props.updateAnswer(["blabla", "blahdi blah"]);

		this.ctx = this.canvas.getContext("2d");

		this.canvas.width = window.innerWidth * window.devicePixelRatio;
		this.canvas.height = window.innerHeight * window.devicePixelRatio;

		if (!DrawUtils.isTouch) {
			this.canvas.addEventListener("mousedown", () => { this.isMouseDown = true; })
		}

		this.canvas.addEventListener(DrawUtils.isTouch ? "touchmove" : "mousemove", e => {
			if (DrawUtils.isTouch || this.isMouseDown) {
				this.drawHandler(DrawUtils.isTouch ? e.touches[0] : e);
			}
		})

		this.canvas.addEventListener(DrawUtils.isTouch ? "touchend" : "mouseup", () => {
			this.isMouseDown = false;

			this.paths.push(this.currentLine);
			this.updateAnswer(this.paths);
			this.currentLine = [];
		})
	}

	render() {
		return (
			<div className="draw">
				{this.props.question}
				<canvas ref={c => { this.canvas = c; }} />
			</div>
		);
	}
}

export default Draw;