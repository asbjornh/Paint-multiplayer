import React from "react";
import PropTypes from "prop-types";

const Lobby = ({ gameCode, players, startGame, visible }) => {
	if (visible) {
		return (
			<div className="lobby">
				<h2>{gameCode}</h2>
				<button type="button" onClick={startGame}>Start spill</button>
			</div>
		);
	} else {
		return null;
	}
};

Lobby.propTypes = {
	gameCode: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func,
	visible: PropTypes.bool
}

export default Lobby;