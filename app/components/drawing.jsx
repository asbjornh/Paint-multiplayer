import React from 'react';
import PropTypes from 'prop-types';

import DrawUtils from '../draw-utils';

class Drawing extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    pixelRatio: PropTypes.number,
    paths: PropTypes.array
  };

  componentDidMount() {
    this.canvas.width = this.props.width;
    this.canvas.height = this.props.height;
    if (this.props.paths && this.props.paths.length) {
      DrawUtils.drawPaths(this.canvas, this.props.paths, this.props.pixelRatio);
    }
  }

  render() {
    return (
      <canvas
        ref={c => {
          this.canvas = c;
        }}
      />
    );
  }
}

export default Drawing;
