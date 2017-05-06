import React from "react";
import PropTypes from "prop-types";

import DrawUtils from "../draw-utils";


class Draw extends React.Component {
	static propTypes = {
		question: PropTypes.string,
		updateAnswer: PropTypes.func
	}

	currentLine = []
	paths = []
	dimensions = {}

	drawHandler(coords) {
		this.currentLine.push({
			x: coords.clientX - this.canvas.getBoundingClientRect().left,
			y: coords.clientY - this.canvas.getBoundingClientRect().top
		});

		this.currentLine = DrawUtils.smoothPoints(this.currentLine, window.devicePixelRatio);

		DrawUtils.drawLine(this.ctx, this.currentLine, window.devicePixelRatio);
	}

	onTouchStart = e => {
		this.drawHandler(e.touches[0]);
	}

	onTouchMove = e => {
		this.drawHandler(e.touches[0]);
	}

	onTouchEnd = () => {
		this.paths.push(this.currentLine);
		this.props.updateAnswer({ paths: this.paths, dimensions: this.dimensions });
		this.currentLine = [];
	}

	componentDidMount() {
		this.ctx = this.canvas.getContext("2d");
		const width = this.canvas.offsetWidth * window.devicePixelRatio;
		const height = this.canvas.offsetHeight * window.devicePixelRatio;
		this.canvas.width = width;
		this.canvas.height = height;

		this.dimensions = {
			width: width,
			height: height,
			pixelRatio: window.devicePixelRatio
		};

		this.props.updateAnswer({ dimensions: this.dimensions });
	}

	render() {
		return (
			<div className="draw">
				<div className="draw-content">
					<div className="draw-header">
						<p className="draw-label">Du skal tegne:</p>
						<p className="draw-question">{this.props.question}</p>
					</div>
					<canvas
						ref={c => { this.canvas = c; }}
						onTouchStart={this.onTouchStart}
						onTouchMove={this.onTouchMove}
						onTouchEnd={this.onTouchEnd}
					/>
				</div>
			</div>
		);
	}
}

export default Draw;