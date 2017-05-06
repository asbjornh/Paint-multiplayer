import React from "react";
import PropTypes from "prop-types";

class Select extends React.Component {
	static propTypes = {
		id: PropTypes.string,
		options: PropTypes.arrayOf(PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string
		})),
		updateValue: PropTypes.func
	}

	state = {
		currentValue: ""
	}

	getLabel(value) {
		const option = this.props.options.find(o => {
			return o.value === value
		});

		return option.label;
	}

	componentDidMount() {
		this.setState({ currentValue: this.getLabel(this.select.value) });
	}

	onChange() {
		this.props.updateValue(this.select.value);
		this.setState({ currentValue: this.getLabel(this.select.value) });
	}

	render() {
		return (
			<div className="select">
				<div className="select-content">
					<div className="select-value">{this.state.currentValue}</div>
					<select ref={s => { this.select = s; }} id={this.props.id} onChange={this.onChange.bind(this)}>
						{this.props.options.map(o =>
							<option key={o.value} value={o.value}>{o.label}</option>
						)}
					</select>
				</div>
			</div>
		);
	}
}

export default Select;