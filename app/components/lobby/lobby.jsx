import React from 'react';
import PropTypes from 'prop-types';

import FlipMove from 'react-flip-move';
import Button from 'components/button';
import Select from 'components/select';

const Lobby = ({ gameCode, players, startGame, setDifficulty }) => {
  return (
    <div className="lobby">
      <div className="lobby-inner">
        <div className="lobby-information">
          <p className="game-code-label">Spillkode:</p>
          <p className="game-code">{gameCode}</p>
          <p className="players-label">Spillere:</p>
          <div className="lobby-player-list">
            <ul>
              <FlipMove duration={400} easing="cubic-bezier(.34,2.5,.46,.98)">
                {players.map(p => (
                  <li key={p.playerId}>{p.playerName}</li>
                ))}
              </FlipMove>
            </ul>
          </div>
        </div>
        <Select
          id="difficulty-select"
          options={[
            { value: 'easy', label: 'Lette spørsmål' },
            { value: 'medium', label: 'Middels spørsmål' },
            { value: 'hard', label: 'Vanskelige spørsmål' }
          ]}
          updateValue={setDifficulty}
        />
        <Button text="Start spill" onClick={startGame} />
      </div>
    </div>
  );
};

Lobby.propTypes = {
  gameCode: PropTypes.string,
  players: PropTypes.array,
  startGame: PropTypes.func,
  setDifficulty: PropTypes.func
};

export default Lobby;
