const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const solver = new Solver();

let validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidPuzzle =
  "1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let complete =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite("UnitTests", () => {
  suite("solver tests", () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
      assert.equal(solver.solve(validPuzzle), complete);
      done();
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
      assert.equal(solver.simpleValidate(invalidPuzzle), false);
      done();
    });

    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
      assert.equal(solver.simpleValidate(invalidPuzzle), false);
      done();
    });

    test("Logic handles a valid row placement", (done) => {
      assert.equal(solver.checkRowPlacement(validPuzzle, "0", "1", "9"), true);
      done();
    });

    test("Logic handles an invalid row placement", (done) => {
      assert.equal(solver.checkRowPlacement(validPuzzle, "0", "1", "1"), false);
      done();
    });

    test("Logic handles a valid column placement", (done) => {
      assert.equal(solver.checkColPlacement(validPuzzle, "0", "1", "8"), true);
      done();
    });

    test("Logic handles an invalid column placement", (done) => {
      assert.equal(solver.checkColPlacement(validPuzzle, "0", "1", "9"), false);
      done();
    });

    test("Logic handles a valid region (3x3 grid) placement", (done) => {
      assert.equal(
        solver.checkRegionPlacement(validPuzzle, "0", "0", "1"),
        false
      );
      done();
    });

    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
      assert.equal(
        solver.checkRegionPlacement(validPuzzle, "0", "1", "1"),
        false
      );
      done();
    });
    test("Valid puzzle strings pass the solver", (done) => {
      assert.equal(solver.solve(validPuzzle), complete);
      done();
    });
    test("Invalid puzzle strings fail the solver", (done) => {
      assert.equal(solver.simpleValidate(invalidPuzzle), false);
      done();
    });
    test("Solver returns the the expected solution for an incomplete puzzzle", (done) => {
      assert.equal(
        solver.solve(
          "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"
        ),
        "218396745753284196496157832531672984649831257827549613962415378185763429374928561"
      );
      done();
    });
  });
});
