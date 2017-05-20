import React from "react";
import PropTypes from "prop-types";

import FlipMove from "react-flip-move";
import Button from "./button";

function sortPlayers(a, b) {
	if (a.score > b.score) return -1;
	if (a.score < b.score) return 1;
	return 0;
}

function getReadyState(players) {
	return players.every(player => player.ready);
}

const Summary = ({ players, startRound }) =>
	<div className="summary">
		<div className="summary-content">
			<div className="summary-header">
				<p>{getReadyState ? "Venter på spillere" : "Runde ferdig" }</p>
			</div>
			<table>
				<tbody>
					<FlipMove duration={400} easing="cubic-bezier(.66,.01,.17,1)">
						{players.sort(sortPlayers).map(player => (
							<tr key={player.playerId}>
								<td className={`summary-ready-status ${player.ready ? "is-ready" : ""}`}></td>
								<td className="summary-player-name">{player.playerName}</td>
								<td className="summary-player-score">
									<span className="summary-points">{player.score}</span>
									<span className="summary-points-label">poeng</span>
								</td>
							</tr>
						))}
					</FlipMove>
				</tbody>
			</table>
			<Button
				className="is-dark"
				text="Neste runde"
				disabled={!getReadyState(players)}
				onClick={startRound}
			/>
		</div>
	</div>;

Summary.propTypes = {
	players: PropTypes.arrayOf(PropTypes.shape({
		playerName: PropTypes.string,
		playerId: PropTypes.string,
		score: PropTypes.number,
		ready: PropTypes.bool
	})),
	startRound: PropTypes.func
};

export default Summary;