"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });
    const validity = solver.validate(puzzle);
    if (validity === -1)
      return res.json({ error: "Invalid characters in puzzle" });
    if (validity === 0)
      return res.json({ error: "Expected puzzle to be 81 characters long" });

    const coordRegex = /^[A-I][1-9]$/;
    if (!coordRegex.test(coordinate))
      return res.json({ error: "Invalid coordinate" });

    const numRegex = /^[1-9]$/;
    if (!numRegex.test(value)) return res.json({ error: "Invalid value" });

    const board = puzzle.match(/.{1,9}/g) ?? [];
    const rowsMap = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8 };
    const row = rowsMap[coordinate[0].toUpperCase()];
    const column = coordinate[1] - 1;

    if (board[row][column] === value) return res.json({ valid: true });

    const conflictsArr = [];
    if (!solver.checkRowPlacement(board, row, column, value))
      conflictsArr.push("row");
    if (!solver.checkColPlacement(board, row, column, value))
      conflictsArr.push("column");
    if (!solver.checkRegionPlacement(puzzle, row, column, value))
      conflictsArr.push("region");

    if (conflictsArr.length > 0)
      return res.json({ valid: false, conflict: conflictsArr });
    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) return res.json({ error: "Required field missing" });
    const validity = solver.validate(puzzle);
    if (validity === -1)
      return res.json({ error: "Invalid characters in puzzle" });
    if (validity === 0)
      return res.json({ error: "Expected puzzle to be 81 characters long" });

    let board = puzzle.match(/.{1,9}/g) ?? [];

    const newBoard = board.map((row) => row.split(""));

    solver.solve(newBoard);

    const solution = newBoard.flat().join("");
    if (solution.includes("."))
      return res.json({ error: "Puzzle cannot be solved" });
    res.json({ solution });
  });
};
