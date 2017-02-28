var Game = function(numRounds) {
	const self = this,
		words = require("./words");

	numRounds = numRounds || 2

	self.players = []
	self.gameInProgress = false
	self.remainingRounds = numRounds

	self.startGame = () => {
		self.gameInProgress = true
		self.createBooks()
	}

	self.checkTurn = () => {
		// Checks if every player has submitted an answer
		return self.players.every((player) => {
			return typeof player.book.pages.slice(-1)[0].answer !== "undefined"
		})
	}

	self.checkRound = () => {
		// Checks if there are more turns left in this round. True if there are more turns
		if (self.players.length % 2 === 0) {
			// If the first player has his own book, the round is over
			return self.players[0].id !== self.players[0].book.owner
		} else if (self.players[0].id === self.players[1].book.owner) {
			self.rotateBooks() // Rotate so each player has his own book
			return false
		} else {
			return true
		}
	}

	self.createBooks = () => {
		self.players.forEach((player) => {
			player.book = {
				owner: player.id,
				pages: [
					{
						question: 	words.easy[Math.floor(Math.random() * words.easy.length)],
						type: 		"draw"
					}
				]
			}
		})
	}

	self.addPages = () => {
		self.players.forEach((player) => {
			var last = player.book.pages.slice(-1)[0]

			player.book.pages.push({
				question: 	last.answer,
				type: 		last.type == "draw" ? "guess" : "draw"
			})
			console.log("pages________________")
			console.log(player.book.pages)
		})
	}

	self.rotateBooks = () => {
		var books = self.players.map((player) => {
			return player.book
		})

		var last = books.pop()
		books.splice(0, 0, last)

		self.players.forEach((player, i) => {
			player.book = books[i];
		})
	}
}

module.exports = Game;