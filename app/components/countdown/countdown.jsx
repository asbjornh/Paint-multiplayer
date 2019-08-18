import React from 'react';
import PropTypes from 'prop-types';

class Countdown extends React.Component {
  static propTypes = {
    currentTime: PropTypes.number,
    totalTime: PropTypes.number
  };

  state = {
    currentTime: this.props.totalTime
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      animate: Math.abs(this.state.currentTime - nextProps.currentTime) <= 1,
      currentTime: nextProps.currentTime - 1
    });
  }

  render() {
    return (
      <div
        className={`countdown ${
          this.state.currentTime < 11
            ? this.state.currentTime < 6
              ? 'pulsate-crazy'
              : 'pulsate-faster'
            : ''
        }`}
      >
        <div className="countdown-content">
          <p className="countdown-time">
            {Math.max(0, parseInt(this.props.currentTime))}
          </p>
          <div className="countdown-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="74px"
              height="74px"
              viewBox="0 0 74 74"
              enableBackground="new 0 0 74 74"
            >
              <circle
                className={this.state.animate ? 'has-animation' : ''}
                fill="none"
                stroke="#FFFFFF"
                strokeDasharray="195"
                strokeDashoffset={Math.min(
                  0,
                  -195 * (this.state.currentTime / this.props.totalTime)
                )}
                strokeWidth="12"
                cx="37"
                cy="37"
                r="31"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default Countdown;
