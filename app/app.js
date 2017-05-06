require("./app.scss");

// import io from "socket.io-client";
import React from "react";
import { render } from "react-dom";

import Main from "./components/main";

render(
	React.createElement(Main),
	document.getElementById("app")
);
