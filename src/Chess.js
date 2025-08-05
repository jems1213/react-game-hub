import React, { useState } from 'react';

const initialBoard = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖']
];

function isWhite(piece) {
  return piece && '♙♖♘♗♕♔'.includes(piece);
}
function isBlack(piece) {
  return piece && '♟♜♞♝♛♚'.includes(piece);
}

function Chess() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null); // {row, col}
  const [whiteTurn, setWhiteTurn] = useState(true);
  const [message, setMessage] = useState('White to move');

  function handleCellClick(row, col) {
    const piece = board[row][col];
    if (selected) {
      // Try to move
      const [fromRow, fromCol] = selected;
      const movingPiece = board[fromRow][fromCol];
      if ((whiteTurn && isWhite(movingPiece)) || (!whiteTurn && isBlack(movingPiece))) {
        // Basic move: allow any move to empty or opponent's piece
        if (
          (movingPiece && (row !== fromRow || col !== fromCol)) &&
          (!board[row][col] || (whiteTurn ? isBlack(board[row][col]) : isWhite(board[row][col])))
        ) {
          const newBoard = board.map(r => r.slice());
          newBoard[row][col] = movingPiece;
          newBoard[fromRow][fromCol] = null;
          setBoard(newBoard);
          setSelected(null);
          setWhiteTurn(!whiteTurn);
          setMessage(whiteTurn ? 'Black to move' : 'White to move');
          return;
        }
      }
      setSelected(null);
    } else {
      // Select a piece
      if (piece && ((whiteTurn && isWhite(piece)) || (!whiteTurn && isBlack(piece)))) {
        setSelected([row, col]);
      }
    }
  }

  return (
    <div style={{textAlign: 'center', marginTop: 30}}>
      <h2>Chess (2 Player)</h2>
      <div style={{fontWeight: 'bold', marginBottom: 10}}>{message}</div>
      <div style={{
        display: 'inline-block',
        border: '4px solid #333',
        borderRadius: 8,
        boxShadow: '0 0 20px #00ffe7',
      }}>
        {board.map((rowArr, row) => (
          <div key={row} style={{display: 'flex'}}>
            {rowArr.map((piece, col) => {
              const isSel = selected && selected[0] === row && selected[1] === col;
              const isLight = (row + col) % 2 === 0;
              return (
                <div
                  key={col}
                  onClick={() => handleCellClick(row, col)}
                  style={{
                    width: 48,
                    height: 48,
                    background: isSel ? '#fff200' : isLight ? '#f0d9b5' : '#b58863',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    cursor: 'pointer',
                    border: '1px solid #333',
                    userSelect: 'none',
                  }}
                >
                  {piece}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{marginTop: 20}}>
        <button onClick={() => { setBoard(initialBoard); setWhiteTurn(true); setSelected(null); setMessage('White to move'); }}>Restart Game</button>
      </div>
    </div>
  );
}

export default Chess;