import React, { useState } from 'react';

const choices = [
  { name: 'Rock', emoji: '✊' },
  { name: 'Paper', emoji: '✋' },
  { name: 'Scissors', emoji: '✌️' },
];

function getResult(player, computer) {
  if (player === computer) return 'Draw!';
  if (
    (player === 'Rock' && computer === 'Scissors') ||
    (player === 'Paper' && computer === 'Rock') ||
    (player === 'Scissors' && computer === 'Paper')
  ) {
    return 'You Win!';
  }
  return 'You Lose!';
}

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');

  function play(choice) {
    const comp = choices[Math.floor(Math.random() * 3)].name;
    setPlayerChoice(choice);
    setComputerChoice(comp);
    setResult(getResult(choice, comp));
  }

  function reset() {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  }

  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h2 style={{color: '#fff200', textShadow: '0 0 10px #fff200'}}>Rock-Paper-Scissors</h2>
      <div style={{margin: '30px 0'}}>
        {choices.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => play(name)}
            disabled={!!playerChoice}
            style={{
              fontSize: 40,
              margin: '0 18px',
              padding: '18px 28px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(90deg, #00ffe7 0%, #fff200 100%)',
              color: '#181c24',
              fontWeight: 'bold',
              boxShadow: '0 0 20px #00ffe7',
              cursor: playerChoice ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {emoji}
            <div style={{fontSize: 18, marginTop: 6}}>{name}</div>
          </button>
        ))}
      </div>
      {playerChoice && (
        <div style={{marginTop: 30, fontSize: 24, color: '#fff'}}>
          <div>You: <span style={{fontSize: 32}}>{choices.find(c => c.name === playerChoice).emoji}</span> {playerChoice}</div>
          <div>Computer: <span style={{fontSize: 32}}>{choices.find(c => c.name === computerChoice).emoji}</span> {computerChoice}</div>
          <div style={{marginTop: 18, fontWeight: 'bold', color: result === 'You Win!' ? 'lime' : result === 'You Lose!' ? 'red' : '#fff200', fontSize: 28}}>{result}</div>
          <button onClick={reset} style={{marginTop: 24, fontSize: 20, padding: '10px 40px', borderRadius: 10, border: 'none', background: '#00ffe7', color: '#181c24', fontWeight: 'bold', boxShadow: '0 0 10px #00ffe7'}}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default RockPaperScissors;