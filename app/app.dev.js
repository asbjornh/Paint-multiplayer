require("./app.scss");

import React from "react";
import { render } from "react-dom";

import Main from "./components/main";

render(
	<Main env="dev" />,
	document.getElementById("app")
);