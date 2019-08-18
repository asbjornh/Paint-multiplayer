import React from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Button from './button';
import TextInput from './text-input';

class JoinForm extends React.Component {
  static propTypes = {
    createGame: PropTypes.func,
    joinGame: PropTypes.func,
    gameCode: PropTypes.string,
    playerName: PropTypes.string,
    setGameCode: PropTypes.func,
    setPlayerName: PropTypes.func
  };

  state = {
    step: 0,
    shakeNameInput: false,
    shakeGameCodeInput: false
  };

  handleName(e) {
    this.props.setPlayerName(e.target.value);
  }

  handleGameCode(e) {
    this.props.setGameCode(e.target.value);
  }

  submitName() {
    if (this.props.playerName) {
      this.setState({ step: this.state.step + 1 });
    } else {
      this.setState({ shakeNameInput: true });
      setTimeout(() => {
        this.setState({ shakeNameInput: false });
      }, 700);
    }
  }

  joinButton() {
    if (this.props.gameCode) {
      this.props.joinGame();
    } else {
      this.setState({ shakeGameCodeInput: true });
      setTimeout(() => {
        this.setState({ shakeGameCodeInput: false });
      }, 700);
    }
  }

  render() {
    return (
      <CSSTransitionGroup
        className="form"
        transitionName="view"
        transitionEnterTimeout={900}
        transitionLeaveTimeout={700}
      >
        {this.state.step === 0 && (
          <div className="form-group step-1">
            <div className="form-group-inner">
              <TextInput
                label="Navn"
                onChange={this.handleName.bind(this)}
                shake={this.state.shakeNameInput}
              />
              <Button onClick={this.submitName.bind(this)} text="Ok!" />
            </div>
          </div>
        )}

        {this.state.step === 1 && (
          <div className="form-group step-2">
            <div className="form-group-inner">
              <TextInput
                className="uppercase"
                maxLength={4}
                label="Spillkode"
                onChange={this.handleGameCode.bind(this)}
                shake={this.state.shakeGameCodeInput}
              />
              <Button
                onClick={this.joinButton.bind(this)}
                text="Bli med i spill"
              />
              <div className="form-separator">eller</div>
              <Button onClick={this.props.createGame} text="Opprett spill" />
            </div>
          </div>
        )}
      </CSSTransitionGroup>
    );
  }
}

export default JoinForm;
