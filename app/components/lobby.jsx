import React from "react";
import PropTypes from "prop-types";

import Button from "./button";

const Lobby = ({ gameCode, players, startGame }) => {
	return (
		<div className="lobby">
			<div className="lobby-inner">
				<h2>{gameCode}</h2>
				<Button text="Start spill" onClick={startGame} />
			</div>
		</div>
	);
};

Lobby.propTypes = {
	gameCode: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func,
	visible: PropTypes.bool
}

export default Lobby;