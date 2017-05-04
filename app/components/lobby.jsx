import React from "react";
import PropTypes from "prop-types";

import Button from "./button";

const Lobby = ({ gameCode, players, startGame }) => {
	return (
		<div className="lobby">
			<div className="lobby-inner">
				<p className="game-code-label">Spillkode:</p>
				<p className="game-code">{gameCode}</p>
				<h2>Spillere:</h2>
				<ul>
					{players.map(p => (
						<li key={p.playerId}>{p.playerName}</li>
					))}
				</ul>
				<Button text="Start spill" onClick={startGame} />
			</div>
		</div>
	);
};

Lobby.propTypes = {
	gameCode: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func
}

export default Lobby;