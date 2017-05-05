import React from "react";
import PropTypes from "prop-types";

const Countdown = ({ currentTime, totalTime }) => {
	var svg =
		`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="74px" height="74px" viewBox="0 0 74 74" enable-background="new 0 0 74 74">
			<circle fill="none" stroke="#FFFFFF" stroke-dasharray="195" stroke-dashoffset=${Math.min(0, -195 * (currentTime / totalTime))} stroke-width="12" cx="37" cy="37" r="31" />
		</svg>`;

	return (
		<div className={`countdown ${ currentTime < 10 ? currentTime < 5 ? "pulsate-crazy" : "pulsate-faster" : "" }`}>
			<div className="countdown-content">
				<p className="countdown-time">
					{Math.max(0, parseInt(currentTime))}
				</p>
				<div className="countdown-circle">
					<div dangerouslySetInnerHTML={{__html: svg }} />
				</div>
			</div>
		</div>
	);
};

Countdown.propTypes = {
	currentTime: PropTypes.number,
	totalTime: PropTypes.number
}

export default Countdown;