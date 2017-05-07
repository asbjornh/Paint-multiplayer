	// $.ajax({
	// 	url: baseUrl + endpoint,
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json"
	// 	},
	// 	data: JSON.stringify(data),
	// 	success: callback,
	// 	error: function (jqxhr, textStatus, errorThrown) {
	// 		errorCallback && errorCallback(jqxhr, textStatus, errorThrown)
	// 	}
	// })

	// $.ajax({
	// 	url: baseUrl + endpoint,
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json"
	// 	},
	// 	success: callback,
	// 	error: function (jqxhr, textStatus, errorThrown) {
	// 		errorCallback && errorCallback(jqxhr, textStatus, errorThrown)
	// 	}
	// })


class api {
	constructor(env) {
		this.baseUrl = env === "dev" ? "http://localhost:3000/api/" : "/api/"
	}

	post(endpoint, data, callback ) {
		fetch(this.baseUrl + endpoint, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(res => {
			if (res.ok) { return res.json() }

			throw new Error("Det ble noe føkk med POST");
		}).then(callback);
	}

	get(endpoint, callback ) {
		fetch(this.baseUrl + endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}).then( res => {
			if (res.ok) { return res.json() }

			throw new Error("Det ble noe føkk med GET");
		}).then(callback);
	}

	joinGame(data, callback, errorCallback) {
		this.post("join-game", data, callback, errorCallback);
	}

	createGame(callback, errorCallback) {
		this.get("create-game", callback, errorCallback);
	}

	startGame(data, errorCallback) {
		this.post("start-game", data, null, errorCallback);
	}

	startNewGame(data, errorCallback) {
		this.post("start-new-game", data, null, errorCallback);
	}

	startRound(data, errorCallback) {
		this.post("start-round", data, null, errorCallback);
	}

	submitPage(data, errorCallback) {
		this.post("submit-page", data, null, errorCallback);
	}

	submitRating(data, errorCallback) {
		this.post("submit-rating", data, null, errorCallback);
	}
}

export default api;