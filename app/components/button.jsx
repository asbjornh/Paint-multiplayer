import React from "react";
import PropTypes from "prop-types";

class Button extends React.Component {
	static propTypes = {
		onClick: PropTypes.func,
		text: PropTypes.string,
		className: PropTypes.string,
		disabled: PropTypes.bool
	}

	state = {
		hasTouch: false
	}

	touchStart() {
		this.setState({ hasTouch: true })
	}

	touchEnd() {
		this.setState({ hasTouch: false })
	}

	render() {
		return (
			<button
				type="button"
				className={this.props.className + ` ${this.state.hasTouch ? "hover": ""}`}
				onClick={this.props.onClick}
				onTouchStart={this.touchStart.bind(this)}
				onTouchEnd={this.touchEnd.bind(this)}
				disabled={this.props.disabled}
			>
				<span>{this.props.text}</span>
			</button>
		);
	}
}

export default Button;