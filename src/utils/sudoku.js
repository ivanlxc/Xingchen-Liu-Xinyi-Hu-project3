function boxDims(size) {
  return size === 6 ? { boxRows: 2, boxCols: 3 } : { boxRows: 3, boxCols: 3 };
}

export function checkViolations(board, size) {
  const { boxRows, boxCols } = boxDims(size);
  const errors = Array.from({ length: size }, () => Array(size).fill(false));

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const val = board[row][col];
      if (val === 0) continue;

      for (let c = 0; c < size; c++) {
        if (c !== col && board[row][c] === val) {
          errors[row][col] = true;
          errors[row][c] = true;
        }
      }
      for (let r = 0; r < size; r++) {
        if (r !== row && board[r][col] === val) {
          errors[row][col] = true;
          errors[r][col] = true;
        }
      }
      const sr = Math.floor(row / boxRows) * boxRows;
      const sc = Math.floor(col / boxCols) * boxCols;
      for (let r = sr; r < sr + boxRows; r++) {
        for (let c = sc; c < sc + boxCols; c++) {
          if ((r !== row || c !== col) && board[r][c] === val) {
            errors[row][col] = true;
            errors[r][c] = true;
          }
        }
      }
    }
  }
  return errors;
}

export function checkComplete(board, errors, size) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return false;
      if (errors[r][c]) return false;
    }
  }
  return true;
}

export function findHint(board, initialBoard, size) {
  const { boxRows, boxCols } = boxDims(size);
  const hintCells = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (initialBoard[row][col] !== 0 || board[row][col] !== 0) continue;
      const candidates = [];
      for (let num = 1; num <= size; num++) {
        let valid = true;
        for (let c = 0; c < size; c++) {
          if (board[row][c] === num) { valid = false; break; }
        }
        if (!valid) continue;
        for (let r = 0; r < size; r++) {
          if (board[r][col] === num) { valid = false; break; }
        }
        if (!valid) continue;
        const sr = Math.floor(row / boxRows) * boxRows;
        const sc = Math.floor(col / boxCols) * boxCols;
        outer: for (let r = sr; r < sr + boxRows; r++) {
          for (let c = sc; c < sc + boxCols; c++) {
            if (board[r][c] === num) { valid = false; break outer; }
          }
        }
        if (valid) candidates.push(num);
      }
      if (candidates.length === 1) {
        hintCells.push({ row, col, value: candidates[0] });
      }
    }
  }
  if (hintCells.length === 0) return null;
  return hintCells[Math.floor(Math.random() * hintCells.length)];
}

export function emptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}
