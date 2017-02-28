const port = process.env.port || 3000

const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

const utils = require("./server/utils")
const Game = require("./server/game")


app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

app.get(/^(.+)$/, (req, res) => {
	// console.log('static file request : ' + req.params[0])
	res.sendFile( __dirname + req.params[0])
})

http.listen(port, () => {
	console.log("listening on " + port)
})




var games = {}

io.on("connection", (socket) => {
	console.log("user connected to socket", socket.id)

	socket.on("join", (player) => {
		socket.join(player.gamecode)
		socket.player = player

		player.id = socket.id

		if (!games[player.gamecode].gameInProgress) {
			games[player.gamecode].players.push(player)
			
			io.sockets.in(player.gamecode).emit("debug", "player " + player.name + " joined")
			io.sockets.in(player.gamecode).emit("debug", games[player.gamecode].players)
		}
	})

	socket.on("creategame", () => {
		var gamecode = utils.createGameCode(Object.getOwnPropertyNames(games))
		socket.emit("gamecreated", gamecode)
		games[gamecode] = new Game()
	})

	socket.on("userinput", (data) => {
		socket.broadcast.emit("userinput", data)
	})

	socket.on("gameend", (data) => {
		console.log("game ended", data)
	})

	socket.on("startgame", (gamecode) => {
		console.log("game started")
		const game = games[gamecode]

		game.playerSockets = io.sockets.in(gamecode)

		game.startGame()
		game.playerSockets.emit("debug", "game started")
		turn(game)

	})

	turn = (game) => {
		game.players.forEach((player) => {
			var socket = io.sockets.connected[player.id],
				page = player.book.pages.slice(-1)[0]
	
			page.name = player.name

			socket.emit("turnstart", page)
		})

		setTimeout(function() {
			game.playerSockets.emit("turnend")
		}, 1000);
	}

	socket.on("turnend", (answer) => {
		socket.player.book.pages.slice(-1)[0].answer = answer

		const game = games[socket.player.gamecode]

		// Check that everyone has submitted answer
		if (game.checkTurn()) {
			game.rotateBooks()

			// Check if round is over
			if (game.checkRound()) {
				game.playerSockets.emit("debug", "new turn")
				game.addPages()
				turn(game)
			} else {
				game.playerSockets.emit("debug", "round over")
				game.remainingRounds--

				// Check if game is over
				if (game.remainingRounds == 0) {
					game.playerSockets.emit("debug", "game over")
					game.playerSockets.emit("debug", game.players)
				} else {
					game.playerSockets.emit("debug", "new round")
					game.createBooks()
					turn(game)
				}
			}
		}
	})
})
