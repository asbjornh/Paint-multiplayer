import React from 'react';
import PropTypes from 'prop-types';

import DrawUtils from '../draw-utils';

class Draw extends React.Component {
  static propTypes = {
    question: PropTypes.string,
    updateAnswer: PropTypes.func
  };

  currentLine = [];
  paths = [];
  dimensions = {};

  drawHandler(coords) {
    const pixelRatio = window.devicePixelRatio;

    this.currentLine.push({
      x:
        (coords.clientX - this.canvas.getBoundingClientRect().left) *
        pixelRatio,
      y: (coords.clientY - this.canvas.getBoundingClientRect().top) * pixelRatio
    });

    this.currentLine = DrawUtils.smoothPoints(this.currentLine);
    DrawUtils.clearCanvas(this.canvas);
    DrawUtils.drawLine(this.canvas, this.currentLine, pixelRatio);
  }

  onTouchStart = e => {
    this.drawHandler(e.touches[0]);
  };

  onTouchMove = e => {
    this.drawHandler(e.touches[0]);
  };

  onTouchEnd = () => {
    this.paths.push(this.currentLine);
    this.props.updateAnswer({ paths: this.paths, dimensions: this.dimensions });
    this.currentLine = [];
    DrawUtils.transferImage(this.canvas, this.storeCanvas);
    DrawUtils.clearCanvas(this.canvas);
  };

  preventScrolling = e => {
    e.preventDefault();
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.preventScrolling);
    const width = this.canvas.offsetWidth * window.devicePixelRatio;
    const height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.canvas.width = width;
    this.canvas.height = height;
    this.storeCanvas.width = width;
    this.storeCanvas.height = height;

    this.dimensions = {
      width: width,
      height: height,
      pixelRatio: window.devicePixelRatio
    };

    this.props.updateAnswer({ dimensions: this.dimensions });
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.preventScrolling);
  }

  render() {
    return (
      <div className="draw">
        <div className="draw-content">
          <div className="draw-header">
            <p className="draw-label">Du skal tegne:</p>
            <p className="draw-question">{this.props.question}</p>
          </div>
          <canvas
            ref={c => {
              this.storeCanvas = c;
            }}
          />
          <canvas
            ref={c => {
              this.canvas = c;
            }}
            onTouchStart={this.onTouchStart}
            onTouchMove={this.onTouchMove}
            onTouchEnd={this.onTouchEnd}
          />
        </div>
      </div>
    );
  }
}

export default Draw;
