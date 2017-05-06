import React from "react";
import PropTypes from "prop-types";

import DrawUtils from "../draw-utils";

class Guess extends React.Component {
	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		pixelRatio: PropTypes.number,
		paths: PropTypes.array,
		updateAnswer: PropTypes.func
	}

	componentDidMount() {
		console.log(this.props.width, this.props.height, this.props.pixelRatio, this.props.path);
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = this.props.width;
		this.canvas.height = this.props.height;
		DrawUtils.drawPaths(this.ctx, this.props.paths, this.props.pixelRatio);
	}

	render() {
		return (
			<div className="guess">
				<div className="guess-content">
					<div className="draw-header">
						<p className="draw-label">Gjett hva dette er</p>
					</div>
					<canvas ref={c => { this.canvas = c; }} />
				</div>
			</div>
		);
	}
}

export default Guess;