import React from "react";
import io from "socket.io-client";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import api from "../api-helper";
import Globals from "../../globals";

import Countdown from "./countdown";
import JoinForm from "./join-form";
import Lobby from "./lobby";
import Guess from "./guess";
import Draw from "./draw";

const socket = io("//localhost:3000"); // TODO: fix for production

class Main extends React.Component {
	timer

	state = {
		uiState: "join",
		playerName: "",
		gameCode: "",
		players: [],
		playerId: "",
		turnTimeRemaining: 0
	};

	setPlayerName(playerName) {
		this.setState({ playerName: playerName });
	}

	setGameCode(gameCode) {
		this.setState({ gameCode: gameCode.toUpperCase() });
	}

	joinGame() {
		api.joinGame({
			gameCode: this.state.gameCode,
			playerName: this.state.playerName,
			playerId: this.state.playerId
		}, res => {
			if (res.isSuccess) {
				this.setState({ uiState: "lobby" });
			}
		});
	}

	createGame() {
		api.createGame(res => {
			this.setState({ gameCode: res.gameCode });
			this.joinGame();
		});
	}

	startGame() {
		api.startGame({ gameCode: this.state.gameCode });
	}

	startRound() {
		api.startRound({ gameCode: this.state.gameCode });
	}

	updateAnswer(answer) {
		const currentPage = this.state.currentPage;
		currentPage.answer = answer;
		this.setState({ currentPage: currentPage });
	}

	componentDidMount() {
		socket.on("get-socket-id", playerId => {
			this.setState({ playerId: playerId });
		});

		socket.on("get-player-list", players => {
			this.setState({ players: players });
		});

		socket.on("get-round-ready-state", isReady => {
			this.setState({ readyForRound: isReady });
		})

		socket.on("turn-start", page => {
			console.log("turn start", page);
			this.setState({ uiState: "game", currentPage: page, turnTimeRemaining: Globals.turnDuration });
			this.timer = setInterval(() => {
				this.setState({ turnTimeRemaining: this.state.turnTimeRemaining - 0.1 });
			}, 100);
		});

		socket.on("turn-end", () => {
			console.log("turn end");
			api.submitPage({
				gameCode: this.state.gameCode,
				playerId: this.state.playerId,
				answer: this.state.currentPage.answer
			})
			window.clearInterval(this.timer);
		});

		socket.on("rate", pages => {
			// TODO: create view and stuff
			this.setState({ uiState: "rate" });
			api.submitRating({
				gameCode: this.state.gameCode,
				playerId: this.state.playerId,
				ratedPages: pages.map( page => {
					page.accepted = true;
					return page;
				})
			})
		});

		socket.on("game-over", () => {
			this.setState({ uiState: "summary", gameOver: true });
		})

		socket.on("debug", msg => {
			console.log(msg);
		});
	}

	render() {
		return (
			<CSSTransitionGroup
				className="transition-container"
				transitionName="view"
				transitionEnterTimeout={700}
				transitionLeaveTimeout={700}
			>
				{this.state.uiState !== "game" &&
					<div className={`logo ${ this.state.uiState === "join" ? "is-large" : "" }`}>
						<div className="logo-content">
							<div className="logo-main" />
							<div className="logo-shadow" />
						</div>
					</div>
				}
				{this.state.uiState === "game" &&
					<Countdown
						currentTime={this.state.turnTimeRemaining}
						totalTime={Globals.turnDuration}
					/>
				}
				{this.state.uiState === "join" &&
					<JoinForm
						key={"join"}
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
						key={"lobby"}
						gameCode={this.state.gameCode}
						players={this.state.players}
						startGame={this.startGame.bind(this)}
					/>
				}
				{this.state.uiState === "game" && this.state.currentPage.type === "draw" &&
					<Draw
						key={"draw"}
						question={this.state.currentPage.question}
						updateAnswer={this.updateAnswer.bind(this)}
					/>
				}
				{this.state.uiState === "game" && this.state.currentPage.type === "guess" &&
					<Guess
						key={"guess"}
						question={this.state.currentPage.question}
						updateAnswer={this.updateAnswer.bind(this)}
					/>
				}
				{this.state.uiState === "rate" &&
					<div key={"rate"}>
						<p>Gi poeng</p>
						<button
							onClick={this.startRound.bind(this)}
							disabled={this.state.readyForRound !== true}
						>
							<span>Start neste rune</span>
						</button>
					</div>
				}
				{this.state.uiState === "summary" &&
					<div key={"summary"}>Spill ferdig</div>
				}
			</CSSTransitionGroup>
		);
	}
}

export default Main;