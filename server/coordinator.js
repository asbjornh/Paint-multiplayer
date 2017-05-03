const utils = require("./utils")
const Game = require("./game")

const Coordinator = function (io) {
	var games = {};

	function getSocket(id) {
		return io.sockets.connected[id]
	}

	function getSockets(roomId) {
		return io.sockets.in(roomId)
	}

	this.addPlayerToGame = function (playerName, playerId, gameCode) {
		console.log(playerId)
		console.log(io.sockets.connected)
		getSocket(playerId).join(gameCode)
		// socket.join(gameCode)
		// socket.player = player

		const game = games[gameCode]

		if (game && !game.gameInProgress) {
			game.players.push({
				playerName: playerName,
				playerId:   playerId
			})

			getSockets(gameCode).emit("player-joined", game.players)
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
			getSocket(player.playerId).emit("turnstart", player.book.pages.slice(-1)[0])

			// var socket = getSocket(player.playerId),
			// 	page = player.book.pages.slice(-1)[0]

			// socket.emit("turnstart", page)
		})

		setTimeout(function () {
			getSockets(game.gameCode).emit("turnend")
		}, 1000)
	}

	const rate = game => {
		game.setReadyState(false)
		game.players.forEach(player => {
			getSocket(player.playerId).emit("rate", player.book.pages)

			// var socket = io.sockets.connected[player.id]
			// socket.emit("rate", player.book.pages)
		})
	}

	this.startGame = function (gameCode) {
		var game = games[gameCode]

		game.startGame()
		getSockets(gameCode).emit("debug", "game started")
		turn(game)
	}

	this.submitPage = function (answer, gameCode, playerId) {
		const game = games[gameCode]
		const player = game.getPlayer(playerId)

		// Assign answer to last page of book
		player.book.pages.slice(-1)[0].answer = answer
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
				getSockets(gameCode).emit("debug", "round over")
				getSockets(gameCode).emit("debug", game.players.map(p => p.book.pages))
				game.returnBooksToOwner
				game.remainingRounds--

				rate(game)
			}
		}
	}

	this.submitRating = function (ratedPages, gameCode, playerId) {
		const game = games[gameCode]
		const player = game.getPlayer(playerId)

		game.rate(ratedPages)

		player.ready = true

		if (game.getReadyState()) {
			// Check if game is over
			if (game.remainingRounds === 0) {
				// Game over
				getSockets(gameCode).emit("debug", "game over")
				getSockets(gameCode).emit("debug", game.players)
			} else {
				// New round
				game.createBooks()
				turn(game)
			}
		}
	}
}

module.exports = Coordinator;