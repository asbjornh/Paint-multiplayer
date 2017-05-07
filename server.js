const port = process.env.port || 3000

const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const bodyParser = require("body-parser")

// const utils = require("./server/utils")
// const Game = require("./server/game")
const Coordinator = require("./server/coordinator")
const coordinator = new Coordinator(io)

const jsonParser = bodyParser.json()

app.use(jsonParser)
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

// TODO: remove this
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	next();
})

app.post("/api/join-game", (req, res) => {
	res.json({ isSuccess: req.body && coordinator.addPlayerToGame(req.body) })
})

app.get("/api/create-game", (req, res) => {
	res.json({ gameCode: coordinator.createGame() })
})

app.post("/api/start-game", (req, res) => {
	coordinator.startGame(req.body.gameCode, req.body.difficulty)
	res.json({})
})

app.post("/api/start-new-game", (req, res) => {
	coordinator.startNewGame(req.body.gameCode)
	res.json({})
})

app.post("/api/start-round", (req, res) => {
	coordinator.startRound(req.body.gameCode)
	res.json({})
})

app.post("/api/submit-page", (req, res) => {
	req.body && coordinator.submitPage(req.body)
	res.json({})
})

app.post("/api/submit-rating", (req, res) => {
	req.body && coordinator.submitRating(req.body)
	res.json({})
})

app.get(/^(.+)$/, (req, res) => {
	// console.log('static file request : ' + req.params[0])
	res.sendFile( __dirname + req.params[0])
})

http.listen(port, () => {
	console.log("listening on " + port)
})


io.on("connection", socket => {
	socket.emit("get-socket-id", socket.id)
})




// var games = {}

// io.on("connection", socket => {
// 	console.log("user connected to socket", socket.id)
// 	socket.emit("get-socket-id", socket.id)

// 	socket.on("join", player => {
// 		socket.join(player.gamecode)
// 		socket.player = player

// 		player.id = socket.id

// 		if (games[player.gamecode]) {
// 			if (!games[player.gamecode].gameInProgress) {
// 				games[player.gamecode].players.push(player)

// 				socket.emit("join-successful");
// 				io.sockets.in(player.gamecode).emit("player-joined", games[player.gamecode].players)
// 			} else {
// 				socket.emit("game-already-in-progress")
// 			}
// 		} else {
// 			socket.emit("game-nonexistent")
// 		}
// 	})

// 	socket.on("create-game", () => {
// 		var gamecode = utils.createGameCode(Object.getOwnPropertyNames(games))
// 		socket.emit("gamecreated", gamecode)
// 		games[gamecode] = new Game()
// 	})

// 	socket.on("userinput", data => {
// 		socket.broadcast.emit("userinput", data)
// 	})

// 	const turn = game => {
// 		game.setReadyState(false)
// 		game.players.forEach(player => {
// 			var socket = io.sockets.connected[player.id],
// 				page = player.book.pages.slice(-1)[0]

// 			socket.emit("turnstart", page)
// 		})

// 		setTimeout(function () {
// 			game.playerSockets.emit("turnend")
// 		}, 1000)
// 	}

// 	const rate = game => {
// 		game.setReadyState(false)
// 		game.players.forEach(player => {
// 			var socket = io.sockets.connected[player.id]

// 			socket.emit("rate", player.book.pages)
// 		})
// 	}

// 	socket.on("start-game", gamecode => {
// 		console.log("game", gamecode, "started")
// 		var game = games[gamecode]

// 		game.playerSockets = io.sockets.in(gamecode)

// 		game.startGame()
// 		game.playerSockets.emit("debug", "game started")
// 		turn(game)
// 	})

// 	socket.on("turnend", answer => {
// 		var game = games[socket.player.gamecode]

// 		// Assign answer to last page of book
// 		socket.player.book.pages.slice(-1)[0].answer = answer
// 		socket.player.ready = true

// 		// Check that everyone has submitted answer
// 		if (game.getReadyState()) {
// 			// Turn has ended
// 			game.rotateBooks()

// 			// Check if round is over
// 			if (game.checkRound()) {
// 				// New turn
// 				game.addPages()
// 				turn(game)
// 			} else {
// 				// Round over
// 				game.playerSockets.emit("debug", "round over")
// 				game.playerSockets.emit("debug", game.players.map(p => p.book.pages))
// 				game.returnBooksToOwner
// 				game.remainingRounds--

// 				rate(game)
// 			}
// 		}
// 	})

// 	socket.on("rating", ratedPages => {
// 		var game = games[socket.player.gamecode]

// 		game.rate(ratedPages)

// 		socket.player.ready = true

// 		if (game.getReadyState()) {
// 			// Check if game is over
// 			if (game.remainingRounds === 0) {
// 				// Game over
// 				game.playerSockets.emit("debug", "game over")
// 				game.playerSockets.emit("debug", game.players)
// 			} else {
// 				// New round
// 				game.createBooks()
// 				turn(game)
// 			}
// 		}
// 	})
// })
