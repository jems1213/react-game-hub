import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect, useRef } from 'react';
import Board from './Board';
import Snake from './Snake';
import Food from './Food';
import RockPaperScissors from './RockPaperScissors';

const BOARD_SIZE = 25;
const INITIAL_SNAKE = [
  { x: 12, y: 12 },
  { x: 12, y: 13 },
  { x: 12, y: 14 }
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

function getRandomCoordinates(snake) {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  } while (snake.some(seg => seg.x === position.x && seg.y === position.y));
  return [position.x, position.y];
}

function App() {
  const [selectedGame, setSelectedGame] = useState('menu');

  // Snake game state
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomCoordinates(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);
  moveRef.current = direction;

  // Responsive: detect if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 700);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle keyboard
  useEffect(() => {
    if (selectedGame !== 'snake') return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (moveRef.current.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (moveRef.current.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (moveRef.current.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (moveRef.current.x !== -1) setDirection({ x: 1, y: 0 }); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame]);

  // Game loop
  useEffect(() => {
    if (selectedGame !== 'snake' || gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y
        };
        // Check collision
        if (
          newHead.x < 0 || newHead.x >= BOARD_SIZE ||
          newHead.y < 0 || newHead.y >= BOARD_SIZE ||
          prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake = [newHead, ...prevSnake];
        // Eat food
        if (newHead.x === food[0] && newHead.y === food[1]) {
          setFood(getRandomCoordinates(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [selectedGame, food, gameOver]);

  function restartSnakeGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomCoordinates(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  }

  // On-screen controls for mobile
  function handleMobileMove(dir) {
    if (dir === 'up' && moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
    if (dir === 'down' && moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
    if (dir === 'left' && moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
    if (dir === 'right' && moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
  }

  if (selectedGame === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #10131a 0%, #181c24 100%)',
      }}>
        <div style={{
          background: 'rgba(24,28,36,0.95)',
          borderRadius: 24,
          boxShadow: '0 0 40px #00ffe7, 0 0 10px #00ffe7 inset',
          padding: isMobile ? '32px 8px' : '48px 36px',
          textAlign: 'center',
          minWidth: isMobile ? 220 : 340,
          maxWidth: isMobile ? 320 : 400,
        }}>
          <h1 style={{
            color: '#00ffe7',
            fontFamily: 'Orbitron, Arial, sans-serif',
            fontSize: isMobile ? '2rem' : '2.8rem',
            textShadow: '0 0 10px #00ffe7, 0 0 20px #00ffe7',
            marginBottom: 24,
            letterSpacing: 2,
          }}>Game Hub</h1>
          <button
            onClick={() => setSelectedGame('snake')}
            style={{
              fontSize: isMobile ? 18 : 24,
              padding: isMobile ? '12px 30px' : '18px 60px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(90deg, #00ffe7 0%, #fff200 100%)',
              color: '#181c24',
              fontWeight: 'bold',
              boxShadow: '0 0 20px #00ffe7',
              cursor: 'pointer',
              marginBottom: 12,
              letterSpacing: 1,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            Play Snake
          </button>
          <button
            onClick={() => setSelectedGame('rps')}
            style={{
              fontSize: isMobile ? 18 : 24,
              padding: isMobile ? '12px 20px' : '18px 40px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(90deg, #fff200 0%, #00ffe7 100%)',
              color: '#181c24',
              fontWeight: 'bold',
              boxShadow: '0 0 20px #fff200',
              cursor: 'pointer',
              marginBottom: 12,
              letterSpacing: 1,
              marginLeft: isMobile ? 0 : 16,
              transition: 'background 0.2s, color 0.2s',
              display: isMobile ? 'block' : 'inline-block',
            }}
          >
            Rock-Paper-Scissors
          </button>
        </div>
      </div>
    );
  }
  if (selectedGame === 'snake') {
    return (
      <div style={{textAlign: 'center'}}>
        <button onClick={() => setSelectedGame('menu')} style={{
          background: 'none',
          color: '#00ffe7',
          border: '2px solid #00ffe7',
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: 18,
          margin: '24px 0 0 0',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 0 10px #00ffe7',
        }}>Back to Menu</button>
        <h2 className="neon-header" style={{marginTop: 16}}>Snake Game</h2>
        <div className="neon-score">Score: {score}</div>
        <div className="game-board" style={{ width: isMobile ? '98vw' : BOARD_SIZE * 20, height: isMobile ? '98vw' : BOARD_SIZE * 20, maxWidth: 500, maxHeight: 500, position: 'relative', margin: '0 auto' }}>
          <Snake snake={snake} />
          <Food food={food} />
        </div>
        {/* On-screen controls for mobile */}
        {isMobile && (
          <div style={{ margin: '24px auto 0 auto', maxWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => handleMobileMove('up')} style={navBtnStyle}>▲</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => handleMobileMove('left')} style={navBtnStyle}>◀</button>
              <button onClick={() => handleMobileMove('down')} style={navBtnStyle}>▼</button>
              <button onClick={() => handleMobileMove('right')} style={navBtnStyle}>▶</button>
            </div>
          </div>
        )}
        <button className="restart-btn" onClick={restartSnakeGame} style={{marginTop: 20}}>Restart</button>
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-text">Game Over</div>
            <button className="restart-btn" onClick={restartSnakeGame} style={{marginTop: 20}}>Restart</button>
          </div>
        )}
      </div>
    );
  }
  if (selectedGame === 'rps') {
    return <><button onClick={() => setSelectedGame('menu')} style={{
      background: 'none',
      color: '#00ffe7',
      border: '2px solid #00ffe7',
      borderRadius: 8,
      padding: '8px 24px',
      fontSize: 18,
      margin: '24px 0 0 0',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 0 10px #00ffe7',
    }}>Back to Menu</button><RockPaperScissors isMobile={isMobile} /> </>;
  }
  return null;
}

// Style for mobile nav buttons
const navBtnStyle = {
  width: 48,
  height: 48,
  fontSize: 28,
  borderRadius: 12,
  border: '2px solid #00ffe7',
  background: '#181c24',
  color: '#00ffe7',
  margin: 6,
  fontWeight: 'bold',
  boxShadow: '0 0 10px #00ffe7',
  cursor: 'pointer',
};

export default App;
