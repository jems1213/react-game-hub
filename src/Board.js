import React from 'react';

const Board = ({ board }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${board[0].length}, 20px)` }}>
      {board.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: cell ? 'green' : 'white',
              border: '1px solid #ccc',
            }}
          />
        ))
      )}
    </div>
  );
};

export default Board;
