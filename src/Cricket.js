import React, { useState, useRef, useEffect } from 'react';

const TOTAL_BALLS = 6;
const RUNS = [0, 1, 2, 3, 4, 6];

function getRandomRun(timing) {
  if (timing === 'perfect') {
    return RUNS[Math.floor(Math.random() * 3) + 3]; // 3, 4, 6
  } else if (timing === 'late' || timing === 'early') {
    return RUNS[Math.floor(Math.random() * 4)]; // 0, 1, 2, 3
  }
  return 0;
}

function Cricket() {
  // Game state
  const [ballX, setBallX] = useState(80);
  const [ballY, setBallY] = useState(200);
  const [bowlerY, setBowlerY] = useState(40);
  const [swing, setSwing] = useState(false);
  const [hit, setHit] = useState(false);
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef(null);
  const swingRef = useRef(false);
  const hitRef = useRef(false);
  const gameStateRef = useRef({ balls, wickets, gameOver });

  useEffect(() => {
    gameStateRef.current = { balls, wickets, gameOver };
    swingRef.current = swing;
    hitRef.current = hit;
  }, [balls, wickets, gameOver, swing, hit]);

  function startBall() {
    setBallX(80);
    setBallY(200);
    setBowlerY(40);
    setSwing(false);
    setHit(false);
    setMessage('');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setBowlerY(prev => (prev < 180 ? prev + 10 : 180));
      setBallX(prev => {
        if (prev >= 260) {
          clearInterval(intervalRef.current);
          const { balls, wickets, gameOver } = gameStateRef.current;
          // Only increment wickets if the player did NOT hit (didn't swing or missed)
          if (!swingRef.current || (!hitRef.current && swingRef.current)) {
            setWickets(w => w + 1);
            setMessage('Bowled!');
          }
          setBalls(b => b + 1);
          setTimeout(() => {
            if (balls + 1 >= TOTAL_BALLS || wickets + 1 >= 2) setGameOver(true);
            else startBall();
          }, 1200);
          return prev;
        }
        return prev + 12;
      });
    }, 30);
  }

  function handleSwing() {
    if (swing || hit || gameOver) return;
    setSwing(true);
    let timing = 'late';
    if (ballX > 220 && ballX < 270) timing = 'perfect';
    else if (ballX <= 220 && ballX > 180) timing = 'early';
    const run = getRandomRun(timing);
    if (run === 0) {
      setMessage('Caught!');
      setWickets(w => w + 1);
      setBalls(b => b + 1);
      setTimeout(() => {
        if (balls + 1 >= TOTAL_BALLS || wickets + 1 >= 2) setGameOver(true);
        else startBall();
      }, 1200);
    } else {
      setHit(true);
      setScore(s => s + run);
      setMessage(`You scored ${run} run${run > 1 ? 's' : ''}!`);
      setBalls(b => b + 1);
      setTimeout(() => {
        if (balls + 1 >= TOTAL_BALLS || wickets >= 2) setGameOver(true);
        else startBall();
      }, 1200);
    }
  }

  function resetGame() {
    setScore(0);
    setBalls(0);
    setWickets(0);
    setGameOver(false);
    setMessage('');
    setHit(false);
    setSwing(false);
    setBallX(80);
    setBallY(200);
    setBowlerY(40);
    setTimeout(startBall, 500);
  }

  useEffect(() => {
    startBall();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gameOver && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [gameOver]);

  return (
    <div style={{textAlign: 'center', marginTop: 30}}>
      {/* Stadium background */}
      <div style={{
        background: 'radial-gradient(circle at 50% 80%, #43a047 60%, #1b5e20 100%)',
        borderRadius: 20,
        boxShadow: '0 0 40px #00ffe7, 0 0 10px #00ffe7 inset',
        width: 500,
        margin: '0 auto',
        padding: 10,
        position: 'relative',
      }}>
        {/* Scoreboard */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          borderRadius: 12,
          padding: '10px 0',
          marginBottom: 10,
          fontWeight: 'bold',
          fontSize: 20,
          letterSpacing: 1,
          boxShadow: '0 0 10px #00ffe7',
        }}>
          <span style={{color:'#fff200'}}>Runs: {score}</span> &nbsp; | &nbsp; Balls: {balls}/{TOTAL_BALLS} &nbsp; | &nbsp; Wickets: {wickets}/2
        </div>
        <svg width={480} height={320} style={{background: 'none', borderRadius: 16, display: 'block', margin: '0 auto'}}>
          {/* Stadium stands */}
          <ellipse cx={240} cy={310} rx={220} ry={22} fill="#bdbdbd" opacity={0.5} />
          <ellipse cx={240} cy={300} rx={180} ry={16} fill="#fffde7" opacity={0.7} />
          {/* Pitch */}
          <rect x={210} y={120} width={60} height={160} fill="#ffe082" opacity={0.7} rx={12} />
          {/* Bowler (animated) */}
          <g>
            <rect x={235} y={bowlerY} width={18} height={50} fill="#bdbdbd" rx={8} />
            <circle cx={244} cy={bowlerY} r={16} fill="#ffe082" stroke="#333" strokeWidth={2} />
            {/* Jersey */}
            <rect x={235} y={bowlerY+18} width={18} height={25} fill="#1976d2" rx={6} />
          </g>
          {/* Batsman */}
          <g>
            <rect x={210} y={260} width={36} height={60} fill="#90caf9" rx={12} />
            <circle cx={228} cy={250} r={20} fill="#ffe082" stroke="#333" strokeWidth={2} />
            {/* Bat */}
            <rect x={250} y={285} width={18} height={55} fill="#ffb300" rx={5} transform={swing ? 'rotate(-45 259 285)' : ''} />
            {/* Arms */}
            <rect x={210} y={290} width={54} height={12} fill="#ffe082" rx={5} />
            {/* Jersey */}
            <rect x={210} y={275} width={36} height={25} fill="#1976d2" rx={8} />
          </g>
          {/* Ball */}
          <circle cx={ballX} cy={ballY} r={14} fill={hit ? '#43a047' : '#e53935'} stroke="#333" strokeWidth={2} />
        </svg>
        <div style={{marginTop: 20}}>
          <button onClick={handleSwing} style={{fontSize: 18, padding: '10px 30px', background:'#00ffe7', color:'#181c24', border:'none', borderRadius:8, boxShadow:'0 0 10px #00ffe7', fontWeight:'bold'}} disabled={hit || swing || gameOver}>Swing Bat</button>
          <button onClick={resetGame} style={{marginLeft: 20, background:'#fff200', color:'#181c24', border:'none', borderRadius:8, fontWeight:'bold', padding:'10px 30px'}}>Restart Over</button>
        </div>
        <div style={{color: hit ? 'green' : 'red', fontWeight: 'bold', marginTop: 10, fontSize: 18}}>{message}</div>
        {gameOver && <div style={{color: '#ff004c', fontWeight: 'bold', marginTop: 10, fontSize: 22}}>Over Complete! Final Score: {score}</div>}
      </div>
    </div>
  );
}

export default Cricket;