
const Snake = ({ snake }) => {
  const cellSize = 100 / 25; // 25 is BOARD_SIZE
  return (
    <>
      {snake.map((segment, index) => (
        <div
          key={index}
          className={index === 0 ? "snake-face" : "snake-segment"}
          style={{
            position: 'absolute',
            top: `${segment.y * cellSize}%`,
            left: `${segment.x * cellSize}%`,
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            minWidth: 10,
            minHeight: 10,
            maxWidth: 40,
            maxHeight: 40,
          }}
        ></div>
      ))}
    </>
  );
};

export default Snake;