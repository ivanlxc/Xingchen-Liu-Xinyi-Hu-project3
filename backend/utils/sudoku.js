function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function boxDims(size) {
  return size === 6 ? { boxRows: 2, boxCols: 3 } : { boxRows: 3, boxCols: 3 };
}

function isValidPlacement(board, row, col, num, size) {
  const { boxRows, boxCols } = boxDims(size);
  for (let c = 0; c < size; c++) if (board[row][c] === num) return false;
  for (let r = 0; r < size; r++) if (board[r][col] === num) return false;
  const sr = Math.floor(row / boxRows) * boxRows;
  const sc = Math.floor(col / boxCols) * boxCols;
  for (let r = sr; r < sr + boxRows; r++) {
    for (let c = sc; c < sc + boxCols; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function generateCompleteBoard(size) {
  const board = Array.from({ length: size }, () => Array(size).fill(0));
  function solve() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
          for (const num of nums) {
            if (isValidPlacement(board, row, col, num, size)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  solve();
  return board;
}

export function countSolutions(puzzle, size, maxCount = 2) {
  const board = puzzle.map((row) => [...row]);
  let count = 0;

  function solve() {
    if (count >= maxCount) return;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(board, row, col, num, size)) {
              board[row][col] = num;
              solve();
              if (count >= maxCount) return;
              board[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }

  solve();
  return count;
}

export function solvePuzzle(puzzle, size) {
  const board = puzzle.map((row) => [...row]);
  function solve() {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(board, row, col, num, size)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  return solve() ? board : null;
}

function createUniquePuzzle(solution, cellsToKeep) {
  const size = solution.length;
  const puzzle = solution.map((row) => [...row]);
  const totalCells = size * size;
  const cellsToRemove = totalCells - cellsToKeep;

  const positions = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) positions.push([r, c]);
  }
  const shuffled = shuffle(positions);

  let removed = 0;
  for (let i = 0; i < shuffled.length && removed < cellsToRemove; i++) {
    const [r, c] = shuffled[i];
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    if (countSolutions(puzzle, size, 2) !== 1) {
      puzzle[r][c] = backup;
    } else {
      removed++;
    }
  }
  return puzzle;
}

export function generateSudoku(difficulty) {
  const size = difficulty === 'EASY' ? 6 : 9;
  const cellsToKeep = difficulty === 'EASY' ? 18 : 28 + Math.floor(Math.random() * 3);
  const solution = generateCompleteBoard(size);
  const puzzle = createUniquePuzzle(solution, cellsToKeep);
  return { solution, puzzle, size };
}

export function validateCustomPuzzle(puzzle) {
  if (!Array.isArray(puzzle) || puzzle.length !== 9) {
    return { ok: false, error: 'Custom puzzles must be a 9x9 grid.' };
  }
  for (const row of puzzle) {
    if (!Array.isArray(row) || row.length !== 9) {
      return { ok: false, error: 'Custom puzzles must be a 9x9 grid.' };
    }
    for (const v of row) {
      if (!Number.isInteger(v) || v < 0 || v > 9) {
        return { ok: false, error: 'Cells must be integers 0-9 (0 means empty).' };
      }
    }
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = puzzle[r][c];
      if (v === 0) continue;
      puzzle[r][c] = 0;
      if (!isValidPlacement(puzzle, r, c, v, 9)) {
        puzzle[r][c] = v;
        return { ok: false, error: `Duplicate value ${v} in row/column/box at (${r + 1}, ${c + 1}).` };
      }
      puzzle[r][c] = v;
    }
  }

  const count = countSolutions(puzzle, 9, 2);
  if (count === 0) return { ok: false, error: 'This puzzle has no solution.' };
  if (count > 1) return { ok: false, error: 'This puzzle has multiple solutions. Add more clues.' };
  const solution = solvePuzzle(puzzle, 9);
  return { ok: true, solution };
}
