import Cell from './Cell';

function Board({ board, initialBoard, errors, size, isComplete, hintCell, disabled, onCellChange }) {
  const boxRows = size === 6 ? 2 : 3;
  const boxCols = size === 6 ? 3 : 3;
  const numBoxRow = size / boxRows;
  const numBoxCol = size / boxCols;
  const maxVal = size;

  if (!board || board.length === 0) return null;

  const subgrids = [];
  for (let br = 0; br < numBoxRow; br++) {
    for (let bc = 0; bc < numBoxCol; bc++) {
      const cells = [];
      for (let r = br * boxRows; r < (br + 1) * boxRows; r++) {
        for (let c = bc * boxCols; c < (bc + 1) * boxCols; c++) {
          cells.push(
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              value={board[r][c]}
              maxVal={maxVal}
              isGiven={initialBoard[r][c] !== 0}
              isError={errors[r][c]}
              isComplete={isComplete}
              isHint={hintCell && hintCell.row === r && hintCell.col === c}
              disabled={disabled}
              onChange={onCellChange}
            />
          );
        }
      }
      const subgridClass = size === 6 ? 'subgrid subgrid-3x2' : 'subgrid subgrid-3x3';
      subgrids.push(
        <div key={`${br}-${bc}`} className={subgridClass}>
          {cells}
        </div>
      );
    }
  }

  const boardClass = size === 6 ? 'sudoku-board sudoku-board-6' : 'sudoku-board sudoku-board-9';
  return <div className={boardClass}>{subgrids}</div>;
}

export default Board;
