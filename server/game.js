var Game = function (numRounds) {
	const self = this,
		words = require("./words");

	numRounds = numRounds || 2

	self.players = []
	self.gameInProgress = false
	self.remainingRounds = numRounds
	self.words = []

	self.startGame = difficulty => {
		self.gameInProgress = true
		self.words = words[difficulty] || words.easy
		self.createBooks()

		self.players.forEach( player => {
			player.score = 0
		})
	}

	self.getPlayer = playerId => {
		for (var i=0; i<self.players.length; i++) {
			if (self.players[i].playerId === playerId) return self.players[i]
		}
	}

	self.getReadyState = () => {
		return self.players.every( player => {
			return player.ready
		})
	}

	self.getWord = () => {
		return self.words[Math.floor(Math.random() * self.words.length)]
	}

	self.setReadyState = readyState => {
		self.players.forEach(player => {
			player.ready = readyState
		})
	}

	self.checkRound = () => {
		// Checks if there are more turns left in this round. Returns true if there are more turns
		if (self.players.length % 2 === 0) {
			// If the first player has his own book, the round is over
			return self.players[0].playerId !== self.players[0].book.owner
		} else {
			// If the next player has the first players book, the round is over
			return self.players[0].playerId !== self.players[1].book.owner
		}
	}

	self.returnBooksToOwner = () => {
		while (self.players[0].playerId !== self.players[0].book.owner) {
			self.rotateBooks()
		}
	}

	self.createBooks = () => {
		self.players.forEach(player => {
			player.book = {
				owner: player.playerId,
				pages: [
					{
						question: 	self.getWord(),
						type: 		"draw",
						playerName: player.playerName,
						playerId: 	player.playerId
					}
				]
			}
		})
	}

	self.addPages = () => {
		self.players.forEach(player => {
			var lastPage = player.book.pages.slice(-1)[0]

			player.book.pages.push({
				question: 	lastPage.answer,
				type: 		lastPage.type === "draw" ? "guess" : "draw",
				playerName: player.playerName,
				playerId: 	player.playerId
			})
		})
	}

	self.rotateBooks = () => {
		var books = self.players.map(player => {
			return player.book
		})

		var last = books.pop()
		books.splice(0, 0, last)

		self.players.forEach((player, i) => {
			player.book = books[i];
		})
	}

	self.rate = ratedPages => {
		// Assign points to other player based on player ratings
		ratedPages.forEach(page => {
			if (page.accepted) {
				self.getPlayer(page.playerId).score++
			}
		})
	}
}

module.exports = Game;