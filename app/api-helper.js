import $ from "jquery"; // TODO: check possibility for custom build

const urlPrefix = "http://localhost:3000/api/"; // TODO: fix for prod

function post(endpoint, data, callback, errorCallback) {
	$.ajax({
		url: urlPrefix + endpoint,
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		data: JSON.stringify(data),
		success: callback,
		error: function (jqxhr, textStatus, errorThrown) {
			errorCallback && errorCallback(jqxhr, textStatus, errorThrown)
		}
	})
}

function get(endpoint, callback, errorCallback) {
	$.ajax({
		url: urlPrefix + endpoint,
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		},
		success: callback,
		error: function (jqxhr, textStatus, errorThrown) {
			errorCallback && errorCallback(jqxhr, textStatus, errorThrown)
		}
	})
}

class api {
	static joinGame(data, callback, errorCallback) {
		post("join-game", data, callback, errorCallback);
	}

	static createGame(callback, errorCallback) {
		get("create-game" , callback, errorCallback);
	}

	static startGame(data, errorCallback) {
		post("start-game", data, null, errorCallback);
	}

	static startRound(data, errorCallback) {
		post("start-round", data, null, errorCallback);
	}

	static submitPage(data, errorCallback) {
		console.log("submit page", data);
		post("submit-page", data, null, errorCallback);
	}

	static submitRating(data, errorCallback) {
		post("submit-rating", data, null, errorCallback);
	}
}

export default api;