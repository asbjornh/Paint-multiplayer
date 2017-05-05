import React from "react";
import PropTypes from "prop-types";

import DrawUtils from "../draw-utils";


class Draw extends React.Component {
	static propTypes = {
		question: PropTypes.string,
		updateAnswer: PropTypes.func
	}

	state = {
		timeRemaining: 30
	}

	currentLine = []
	paths = []
	timer

	drawHandler(coords) {
		this.currentLine.push({
			x: coords.clientX - this.canvas.getBoundingClientRect().left,
			y: coords.clientY - this.canvas.getBoundingClientRect().top
		});

		this.currentLine = DrawUtils.smoothPoints(this.currentLine);

		DrawUtils.drawLine(this.ctx, this.currentLine);
	}

	onTouchStart = e => {
		this.drawHandler(e.touches[0]);
	}

	onTouchMove = e => {
		this.drawHandler(e.touches[0]);
	}

	onTouchEnd = () => {
		this.paths.push(this.currentLine);
		this.props.updateAnswer(this.paths);
		this.currentLine = [];
	}

	componentDidMount() {
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
		this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;

		this.timer = setInterval(() => {
			this.setState({ timeRemaining: this.state.timeRemaining - 1 });
		}, 1000);
	}

	componentWillUnmount() {
		window.clearInterVal(this.timer);
		this.timer = null;
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