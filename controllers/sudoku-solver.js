class SudokuSolver {
  validate(puzzleString) {
    const result = puzzleString.search(/[^\d.]/gi);
    if (result !== -1) return -1;
    if (puzzleString.length !== 81) return 0;
    return 1;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (puzzleString[row].includes(value)) return false;
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const columnString = puzzleString.map((row) => row[column]);
    if (columnString.includes(value)) return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Check if the cell is empty.
    if (puzzleString[row * 9 + column] !== ".") {
      return false;
    }

    // Get the start index of the square.
    const squareRow = Math.floor(row / 3);
    const squareColumn = Math.floor(column / 3);
    const squareStartIndex = squareRow * 3 * 9 + squareColumn * 3;

    // Check if the value is already present in the square.
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[squareStartIndex + i * 9 + j] === value) {
          return false;
        }
      }
    }

    // If the value is not already present in the square, return true.
    return true;
  }

  solve(puzzleString) {
    const setBits = (board, rows, columns, subgrids) => {
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (board[row][column] != ".") {
            let bitMask = 1 << (parseInt(board[row][column]) - 1);
            let subgrid = Math.floor(row / 3) * 3 + Math.floor(column / 3);

            rows[row] |= bitMask;
            columns[column] |= bitMask;
            subgrids[subgrid] |= bitMask;
          }
        }
      }
    };

    const backtrack = (board, index, rows, columns, subgrids) => {
      if (index > 80) return true;

      let row = Math.floor(index / 9);
      let column = Math.floor(index % 9);

      if (board[row][column] != ".")
        return backtrack(board, index + 1, rows, columns, subgrids);

      let subgrid = Math.floor(row / 3) * 3 + Math.floor(column / 3);

      for (let i = 0; i < 9; ++i) {
        let mask = 1 << i;
        if (
          rows[row] & mask ||
          columns[column] & mask ||
          subgrids[subgrid] & mask
        )
          continue;

        board[row][column] = (i + 1).toString();
        rows[row] |= mask;
        columns[column] |= mask;
        subgrids[subgrid] |= mask;

        if (backtrack(board, index + 1, rows, columns, subgrids)) return true;

        board[row][column] = ".";
        rows[row] ^= mask;
        columns[column] ^= mask;
        subgrids[subgrid] ^= mask;
      }

      return false;
    };

    const solveSudoku = (board) => {
      const rows = Array(9).fill(0),
        columns = Array(9).fill(0),
        subgrids = Array(9).fill(0);

      setBits(board, rows, columns, subgrids);

      backtrack(board, 0, rows, columns, subgrids);
    };

    solveSudoku(puzzleString);
  }
}

module.exports = SudokuSolver;
