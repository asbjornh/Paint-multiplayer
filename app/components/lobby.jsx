import React from "react";
import PropTypes from "prop-types";

import Button from "./button";
import Select from "./select";

const Lobby = ({ gameCode, players, startGame, setDifficulty }) => {
	return (
		<div className="lobby">
			<div className="lobby-inner">
				<div className="lobby-information">
					<p className="game-code-label">Spillkode:</p>
					<p className="game-code">{gameCode}</p>
					<p className="players-label">Spillere:</p>
					<ul>
						{players.map(p => (
							<li key={p.playerId}>{p.playerName}</li>
						))}
					</ul>
				</div>
				<Select
					id="difficulty-select"
					options={[
						{ value: "easy", label: "Lette spørsmål" },
						{ value: "medium", label: "Middels spørsmål" },
						{ value: "hard", label: "Vanskelige spørsmål" }
					]}
					updateValue={setDifficulty}
				/>
				<Button text="Start spill" onClick={startGame} />
			</div>
		</div>
	);
};

Lobby.propTypes = {
	gameCode: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func,
	setDifficulty: PropTypes.func
}

export default Lobby;