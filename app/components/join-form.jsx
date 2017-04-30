import React from "react";
import PropTypes from "prop-types";

class JoinForm extends React.Component {
	static propTypes = {
		createGame: 	PropTypes.func,
		joinGame: 		PropTypes.func,
		setGameCode: 	PropTypes.func,
		setPlayerName: 	PropTypes.func,
		visible: 		PropTypes.bool
	};

	state = {
		step: 0
	};

	handleName(e) {
		this.props.setPlayerName(e.target.value);
	}

	handleGameCode(e) {
		this.props.setGameCode(e.target.value);
	}

	nextStep() {
		this.setState({ step: ++this.state.step });
	}

	render() {
		if (this.props.visible) {
			return (
				<div className="join-form">
					<div className="join-form-group" style={{ display: this.state.step === 0 ? "block" : "none" }}>
						<input type="text" placeholder="Navn" onChange={this.handleName.bind(this)} />
						<button type="button" onClick={this.nextStep.bind(this)}>Ok!</button>
					</div>

					<div className="join-form-group" style={{ display: this.state.step === 1 ? "block" : "none " }}>
						<input type="text" placeholder="Spillkode" onChange={this.handleGameCode.bind(this)} />
						<button type="button" onClick={this.props.joinGame}>Bli med i spill</button>
						<div className="join-form-separator">eller</div>
						<button type="button" onClick={this.props.createGame}>Opprett spill</button>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default JoinForm;