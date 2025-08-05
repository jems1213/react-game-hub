import React, { useState } from 'react';

const HOOP_X = 120;
const HOOP_Y = 50;
const HOOP_RADIUS = 30;
const BALL_START_X = 150;
const BALL_START_Y = 350;
const BALL_RADIUS = 15;

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function BasketballThrow() {
  const [ball, setBall] = useState({ x: BALL_START_X, y: BALL_START_Y });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  function throwBall() {
    // Randomize the throw direction
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const power = 120 + Math.random() * 60;
    const newX = BALL_START_X + Math.cos(angle) * power;
    const newY = BALL_START_Y - Math.abs(Math.sin(angle) * power);
    setBall({ x: newX, y: newY });
    // Check if in hoop
    if (getDistance(newX, newY, HOOP_X, HOOP_Y) < HOOP_RADIUS) {
      setScore(score + 1);
      setMessage('Scored!');
    } else {
      setMessage('Missed!');
    }
    setTimeout(() => {
      setBall({ x: BALL_START_X, y: BALL_START_Y });
      setMessage('');
    }, 1000);
  }

  return (
    <div style={{textAlign: 'center', marginTop: 20}}>
      <h2>Basketball Throw</h2>
      <p>Score: {score}</p>
      <svg width={300} height={400} style={{border: '1px solid #ccc', background: '#e3f2fd'}}>
        {/* Hoop */}
        <circle cx={HOOP_X} cy={HOOP_Y} r={HOOP_RADIUS} fill="#ff9800" stroke="#b71c1c" strokeWidth={4} />
        {/* Ball */}
        <circle cx={ball.x} cy={ball.y} r={BALL_RADIUS} fill="#f44336" stroke="#333" strokeWidth={2} />
      </svg>
      <div style={{margin: '20px'}}>
        <button onClick={throwBall} style={{fontSize: 18, padding: '10px 30px'}}>Throw!</button>
      </div>
      <div style={{height: 30, fontSize: 20, color: message === 'Scored!' ? 'green' : 'red'}}>{message}</div>
    </div>
  );
}

export default BasketballThrow;