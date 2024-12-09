import { useState } from 'react';

// 渲染棋盘中的每个方格
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 计算获胜者
function calculateWinner(squares, size = 15) {
  const directions = [
    { x: 1, y: 0 },  // 水平
    { x: 0, y: 1 },  // 垂直
    { x: 1, y: 1 },  // 主对角线
    { x: 1, y: -1 }, // 副对角线
  ];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const currentPlayer = squares[row * size + col];
      if (!currentPlayer) continue;

      for (const direction of directions) {
        let count = 1;

        for (let step = 1; step < 5; step++) {
          const nextRow = row + direction.y * step;
          const nextCol = col + direction.x * step;

          if (
            nextRow >= 0 &&
            nextRow < size &&
            nextCol >= 0 &&
            nextCol < size &&
            squares[nextRow * size + nextCol] === currentPlayer
          ) {
            count++;
          } else {
            break;
          }
        }

        if (count === 5) {
          return currentPlayer; // 如果找到五个连续的相同棋子，则返回获胜者
        }
      }
    }
  }

  return null;
}

// 棋盘组件
function Board({ size, squares, onSquareClick }) {
  const board = [];

  // 渲染 15x15 的棋盘
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      row.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => onSquareClick(index)}
        />
      );
    }
    board.push(
      <div className="board-row" key={i}>
        {row}
      </div>
    );
  }

  return <>{board}</>;
}

// 游戏主组件
export default function Game() {
  const size = 15; // 五子棋棋盘大小
  const [history, setHistory] = useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true); // X 先手
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares, size);

  function handlePlay(index) {
    if (winner || currentSquares[index]) {
      return; // 如果已有人获胜或该位置已有棋子，返回
    }

    const nextSquares = currentSquares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board size={size} squares={currentSquares} onSquareClick={handlePlay} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
