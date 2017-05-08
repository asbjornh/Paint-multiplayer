require("./app.scss");

import React from "react";
import { render } from "react-dom";

import Main from "./components/main";

render(
	<Main env="production" />,
	document.getElementById("app")
);