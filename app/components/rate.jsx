import React from 'react';
import PropTypes from 'prop-types';

import Drawing from './drawing';
import Button from './button';

class Rate extends React.Component {
  static propTypes = {
    pages: PropTypes.arrayOf(PropTypes.shape({})),
    submitRating: PropTypes.func
  };

  state = {
    pages: []
  };

  componentDidMount() {
    this.setState({ pages: this.props.pages });
  }

  togglePageApproved(playerId) {
    const pages = this.state.pages;
    const page = pages.find(p => p.playerId === playerId);
    page.accepted = !page.accepted;
    this.setState({ pages: pages });
  }

  submitRating() {
    this.props.submitRating(this.state.pages);
  }

  render() {
    return (
      <div className="rate">
        <div className="rate-content">
          <div className="rate-header">
            <p className="rate-header-label">Gi poeng</p>
            <p>Trykk på tegninger eller ord for å gi poeng</p>
          </div>
          <ul>
            {this.state.pages.map((page, i) => {
              if (page.type === 'draw') {
                return (
                  <li
                    key={page.playerId}
                    onClick={() => {
                      this.togglePageApproved(page.playerId);
                    }}
                  >
                    <Drawing
                      paths={page.answer.paths}
                      {...page.answer.dimensions}
                    />
                    {i === 0 && (
                      // Show original question on first element
                      <p className="rate-guess">{page.question}</p>
                    )}
                    <p className="rate-name">{page.playerName}</p>
                    <div
                      className={`rating-indicator ${
                        page.accepted ? 'is-visible' : ''
                      }`}
                    />
                  </li>
                );
              } else {
                return (
                  <li
                    key={page.playerId}
                    onClick={() => {
                      this.togglePageApproved(page.playerId);
                    }}
                  >
                    <p className="rate-guess">{page.answer}</p>
                    <p className="rate-name">{page.playerName}</p>
                    <div
                      className={`rating-indicator ${
                        page.accepted ? 'is-visible' : ''
                      }`}
                    />
                  </li>
                );
              }
            })}
          </ul>
          <Button
            className="is-dark"
            onClick={this.submitRating.bind(this)}
            text="Ok!"
          />
        </div>
      </div>
    );
  }
}

export default Rate;
