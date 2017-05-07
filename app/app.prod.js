require("./app.scss");

import React from "react";
import { render } from "react-dom";

import Main from "./components/main";

// render(
// 	React.createElement(Main),
// 	document.getElementById("app")
// );


render(
	<Main env="production" />,
	document.getElementById("app")
);