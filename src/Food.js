
const Food = ({ food }) => {
  const [x, y] = food;
  // Use percentage for position and size for mobile responsiveness
  const cellSize = 100 / 25; // 25 is BOARD_SIZE
  return (
    <div
      className="neon-food"
      style={{
        position: 'absolute',
        top: `${y * cellSize}%`,
        left: `${x * cellSize}%`,
        width: `${cellSize}%`,
        height: `${cellSize}%`,
        minWidth: 10, // fallback for very small screens
        minHeight: 10,
        maxWidth: 40,
        maxHeight: 40,
      }}
    ></div>
  );
};

export default Food;