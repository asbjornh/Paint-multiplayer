import React from "react";
import PropTypes from "prop-types";

import mojs from "mo-js";

import Button from "./button";

function sortPlayers(a, b) {
	if (a.score > b.score) return -1;
	if (a.score < b.score) return 1;
	return 0;
}

const burst = new mojs.Burst({
	scale: 3,
	count: 30,
	easing: "expo.out",
	children: {
		shape: ["line", "circle", "line"],
		stroke: [ "#ff7e71", "#e2be82", "#b9dc80", "white" ],
		strokeWidth: 2,
		fill: "transparent",
		scale: { "rand(3,1)" : 0 },
		delay: "stagger( rand(0, 30))",
		degreeShift: "rand(0, 40)",
		duration: 800,
		easing: "sin.out"
	}
});

const confetti = new mojs.Burst({
	top: 0,
	degree: 0,
	count: 40,
	angle: 180,
	children: {
		shape: "rect",
		fill: [ "#ff7e71", "#e2be82", "#b9dc80", "white" ],
		left: "rand(-150, 150)",
		duration: 4000,
		easing: "linear.none",
		isSwirl: true,
		scale: 2,
		angle: "rand(-15, 15)",
		scaleY: { 1 : 0 },
		swirlFrequency: 8,
		swirlSize: 5,
		pathScale: 10,
		direction: "rand(-1,1)",
		delay: "stagger( rand(50, 90))"
	}
})

class GameOver extends React.Component {
	static propTypes = {
		players: PropTypes.arrayOf(PropTypes.shape({
			playerName: PropTypes.string,
			playerId: PropTypes.string,
			score: PropTypes.number
		})),
		startNewGame: PropTypes.func
	}

	players = []

	componentDidMount() {
		// burst.replay();
		confetti.replay();
	}

	render() {
		return (
			<div className="game-over">
				<div className="game-over-content">
					<ul>
						{this.props.players.sort(sortPlayers).slice(0, 3).map((player,i) => (
							<li key={player.playerId} ref={p => this.players[i] = p}>
								<span className="name">{player.playerName}</span>
								<span className="score">{player.score}</span>
							</li>
						))}
					</ul>
					<Button text="Spill igjen!" onClick={this.props.startNewGame} />
				</div>
			</div>
		);
	}
}

export default GameOver;