const createGameCode = function(exclude) {
	var text = ""
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

	do {
		text = ""
		for( var i=0; i < 4; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length))
	} while (exclude.indexOf(text) !== -1)

	return text;
}

module.exports = {
	createGameCode: createGameCode
}