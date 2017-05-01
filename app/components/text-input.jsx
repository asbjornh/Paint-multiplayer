import React from "react";
import PropTypes from "prop-types";

const TextInput = ({ className, label, onChange, shake }) => (
	<div className={`text-input ${className ? className : ""} ${shake ? "shake" : ""}`}>
		<input type="text" placeholder={label} onChange={onChange} />
	</div>
);

TextInput.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	onChange: PropTypes.func,
	shake: PropTypes.bool
};

export default TextInput;