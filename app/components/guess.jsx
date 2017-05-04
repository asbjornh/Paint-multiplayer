import React from "react";
import PropTypes from "prop-types";

const Guess = ({ question, updateAnswer }) =>
	<div className="guess">
		<p>{question}</p>
		<input type="text" onChange={e => updateAnswer(e.target.value)} />
	</div>;

Guess.propTypes = {
	question: PropTypes.array,
	updateAnswer: PropTypes.func
}

export default Guess;