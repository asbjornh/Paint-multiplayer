import React from "react";
import PropTypes from "prop-types";

import TextInput from "./text-input";
import Drawing from "./drawing";

class Guess extends React.Component {
	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		pixelRatio: PropTypes.number,
		paths: PropTypes.array,
		updateAnswer: PropTypes.func
	}

	handleGuess(e) {
		this.props.updateAnswer(e.target.value);
	}

	render() {
		return (
			<div className="guess">
				<div className="guess-content">
					<div className="guess-header">
						<p className="guess-label">Gjett hva dette er</p>
						<TextInput
							className="is-dark"
							label="Ditt svar"
							onChange={this.handleGuess.bind(this)}
						/>
					</div>
					<Drawing
						width={this.props.width}
						height={this.props.height}
						pixelRatio={this.props.pixelRatio}
						paths={this.props.paths}
					/>
				</div>
			</div>
		);
	}
}

export default Guess;