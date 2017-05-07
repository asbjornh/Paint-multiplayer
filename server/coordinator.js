const utils = require("./utils")
const Game = require("./game")
const globals = require("../globals");

const Coordinator = function (io) {
	var games = {};

	function getSocket(id) {
		return io.sockets.connected[id]
	}

	function getSockets(roomId) {
		return io.sockets.in(roomId)
	}

	this.addPlayerToGame = function (data) {
		// data = { playerName, playerId, gameCode }

		const game = games[data.gameCode]

		if (game && !game.gameInProgress) {
			getSocket(data.playerId).join(data.gameCode)

			game.players.push({
				playerName: data.playerName,
				playerId:   data.playerId
			})

			getSockets(data.gameCode).emit("get-player-list", game.players)
			return true;
		}

		return false;
	}

	this.createGame = function () {
		var gameCode = utils.createGameCode(Object.getOwnPropertyNames(games))
		games[gameCode] = new Game()
		games[gameCode].gameCode = gameCode
		return gameCode
	}

	const turn = game => {
		game.setReadyState(false)
		game.players.forEach(player => {
			// Send each player the last page of his current book
			getSocket(player.playerId).emit("turn-start", player.book.pages.slice(-1)[0])

			// var socket = getSocket(player.playerId),
			// 	page = player.book.pages.slice(-1)[0]

			// socket.emit("turnstart", page)
		})

		setTimeout(function () {
			getSockets(game.gameCode).emit("turn-end")
		}, globals.turnDuration * 1000)
	}

	const rate = game => {
		game.setReadyState(false)
		game.players.forEach(player => {
			getSocket(player.playerId).emit("rate", player.book.pages)

			// var socket = io.sockets.connected[player.id]
			// socket.emit("rate", player.book.pages)
		})
	}

	this.startGame = function (gameCode, difficulty) {
		var game = games[gameCode]

		if (!game.gameInProgress) {
			game.startGame(difficulty)
			turn(game)
		}
	}

	this.startNewGame = function (gameCode) {
		var game = games[gameCode]
		game.reset()
	}

	this.startRound = function (gameCode) {
		var game = games[gameCode]
		game.createBooks()
		turn(game)
	}

	this.submitPage = function (data) {
		// data  { gameCode, playerId, answer }
		const game = games[data.gameCode]
		const player = game.getPlayer(data.playerId)

		// Assign answer to last page of book
		player.book.pages.slice(-1)[0].answer = data.answer
		player.ready = true

		// Check that everyone has submitted answer
		if (game.getReadyState()) {
			// Turn has ended
			game.rotateBooks()

			// Check if round is over
			if (game.checkRound()) {
				// New turn
				game.addPages()
				turn(game)
			} else {
				// Round over
				// getSockets(data.gameCode).emit("debug", game.players.map(p => p.book.pages))
				game.returnBooksToOwner()
				game.remainingRounds--

				rate(game)
			}
		}
	}

	this.submitRating = function (data) {
		// data = { gameCode, playerId, ratedPages }
		const game = games[data.gameCode]
		const player = game.getPlayer(data.playerId)

		game.rate(data.ratedPages)

		player.ready = true

		getSockets(data.gameCode).emit("get-remaining-rounds", game.remainingRounds);
		getSockets(data.gameCode).emit("get-player-list", game.players.map( p => {
			return {
				playerName: p.playerName,
				playerId: p.playerId,
				score: p.score,
				ready: p.ready
			}
		}))
	}
}

module.exports = Coordinator;