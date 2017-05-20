import React from "react";
import PropTypes from "prop-types";

import mojs from "mo-js";

import Button from "./button";

function sortPlayers(a, b) {
	if (a.score > b.score) return -1;
	if (a.score < b.score) return 1;
	return 0;
}

class Confetti extends mojs.CustomShape {
	getShape() { return "<path d='M38,12c-12.7,2.8-25.3,2.8-38,0V0c12.7,4.2,25.3,4.2,38,0V12z'></path>"; }
}
mojs.addShape( "confetti", Confetti );

const burst = new mojs.Burst({
	scale: 3,
	count: 20,
	top: 0,
	left: 0,
	children: {
		shape: ["line", "circle", "line"],
		stroke: [ "#ff7e71", "#ffe982", "white" ],
		strokeLinecap: "round",
		strokeWidth: { 2 : 0.01 },
		strokeOpacity: { 1 : 0, easing: "expo.in" },
		fill: "transparent",
		scale: { "rand(2,1)" : 1 },
		delay: "stagger( rand(0, 30))",
		degreeShift: "rand(0, 40)",
		duration: 700,
		easing: "sin.out"
	}
});

const confetti = new mojs.Burst({
	top: -10,
	degree: 0,
	count: 40,
	angle: 180,
	children: {
		shape: "confetti",
		radius: 50,
		angle: { "rand(60, 120)" : "rand(60, 120)" },
		fill: [ "#ff7e71", "#ffe982", "white" ],
		left: "rand(-150, 150)",
		duration: 5000,
		easing: "linear.none",
		swirlFrequency: 30,
		swirlSize: { 15 : 1 },
		pathScale: 15,
		direction: "rand(-1,1)",
		delay: "stagger( rand(50, 90))",
		isSwirl: true
	}
});

const scaleIn = function (el, scale, delay) {
	return new mojs.Tween({
		duration: 800,
		easing: "elastic.out",
		delay: delay,
		onUpdate: ep => {
			el.style.webkitTransform = el.style.transform = `scale(${scale*ep})`;
		}
	}).play();
};

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
		this.players[0].style.webkitTransform = this.players[0].style.transform = "none";

		burst.tune({
			x: this.players[0].getBoundingClientRect().left + 0.5 * this.players[0].offsetWidth,
			y: this.players[0].getBoundingClientRect().top + 0.5 * this.players[0].offsetHeight
		});

		this.players[0].style.webkitTransform = this.players[0].style.transform = "";

		setTimeout(() => {
			scaleIn(this.players[0], 1.3, 0);
			this.players[1] && scaleIn(this.players[1], 1, 200);
			this.players[2] && scaleIn(this.players[2], 1, 400);
			burst.replay();
			confetti.replay();
		}, 1500);
	}

	render() {
		return (
			<div className="game-over">
				<div className="game-over-content">
					<div className="game-over-header">
						<p>Spill ferdig</p>
					</div>
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