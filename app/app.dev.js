require("./app.scss");

import React from "react";
import { render } from "react-dom";

import Main from "./components/main";

import GameOver from "./components/game-over";
// window.onload = function () {
// 	render(
// 		<Main env="dev" />,
// 		document.getElementById("app")
// 	);
// }

window.onload = function () {
	render(
		<GameOver
			players={[
				{
					playerName: "Asbjørn",
					playerId: "1",
					score: 10
				},
				{
					playerName: "My",
					playerId: "2",
					score: 11
				},
				{
					playerName: "Bassefar",
					playerId: "3",
					score: 8
				},
				{
					playerName: "Bassemor",
					playerId: "4",
					score: 5
				}
			]}
			gameOver={function(){}}
		/>,
		document.getElementById("app")
	);
}