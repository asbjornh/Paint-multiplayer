import React from "react";
import io from "socket.io-client";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import JoinForm from "./join-form";
import Lobby from "./lobby";

const socket = io();

class Main extends React.Component {
	state = {
		uiState: "join",
		playerName: "",
		gameCode: "",
		players: []
	};

	setPlayerName(playerName) {
		this.setState({ playerName: playerName });
	}

	setGameCode(gameCode) {
		this.setState({ gameCode: gameCode });
	}

	joinGame(gameCode) {
		// join gameCode
		console.log("join game");
		socket.emit("join", {
			name: this.state.playerName,
			gamecode: this.state.gameCode
		});
		this.setState({ uiState: "lobby" });
	}

	createGame() {
		console.log("create game");
		socket.emit("creategame");
		this.setState({ uiState: "lobby" });
	}

	startGame() {
		console.log("game started");
		this.setState({ uiState: "" });
	}

	componentDidMount() {
		socket.on("gamecreated", gameCode => {
			console.log(gameCode);
			this.setState({ gameCode: gameCode });
			socket.emit("join", {
				name: this.state.playerName,
				gamecode: this.state.gameCode
			});
		});

		socket.on("debug", function (msg) {
			console.log(msg);
		});

		socket.on("turnstart", function (page) {
			// console.log("turn start", page);
			this.setState({ page: page });
		});

		socket.on("turnend", function () {
			socket.emit("turnend", this.state.page.question);
		});

		socket.on("rate", function (pages) {
			socket.emit("rating", pages.map(function (page) {
				page.accepted = true;
				return page;
			}));
		});
	}

	render() {
		return (
			<div>
				<div className={`logo ${ this.state.uiState === "join" ? "is-large" : "" }`}>
					<div className="logo-main" />
					<div className="logo-shadow" />
				</div>
					<CSSTransitionGroup
						className="transition-container"
						transitionName="view"
						transitionEnterTimeout={700}
						transitionLeaveTimeout={700}
					>
						{this.state.uiState === "join" &&
							<JoinForm
								key={1}
								createGame={this.createGame.bind(this)}
								joinGame={this.joinGame.bind(this)}
								gameCode={this.state.gameCode}
								playerName={this.state.playerName}
								setPlayerName={this.setPlayerName.bind(this)}
								setGameCode={this.setGameCode.bind(this)}
							/>
						}
						{this.state.uiState === "lobby" &&
							<Lobby
								key={2}
								gameCode={this.state.gameCode}
								players={this.state.players}
								startGame={this.startGame.bind(this)}
							/>
						}
					</CSSTransitionGroup>
			</div>
		);
	}
}

export default Main;