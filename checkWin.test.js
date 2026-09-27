const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('checkWin function', () => {
  let dom;
  let evaluate;

  beforeEach(() => {
    const htmlPath = path.resolve(__dirname, './index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // We use dangerously to evaluate script content and have access to let variables via eval
    dom = new JSDOM(html, { runScripts: "dangerously" });

    evaluate = (code) => dom.window.eval(code);
  });

  test('should return null for an empty board', () => {
    evaluate('board = Array(9).fill(null);');
    const result = evaluate('checkWin()');
    expect(result).toBeNull();
  });

  test('should return null for a partially filled board with no winner', () => {
    evaluate('board = ["X", "O", "X", null, null, null, null, null, null];');
    const result = evaluate('checkWin()');
    expect(result).toBeNull();
  });

  test('should return null for a full board with no winner (draw)', () => {
    evaluate('board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];');
    const result = evaluate('checkWin()');
    expect(result).toBeNull();
  });

  test('should return correct combination for horizontal win', () => {
    // Top row
    evaluate('board = ["X", "X", "X", null, null, null, null, null, null];');
    expect(evaluate('checkWin()')).toEqual([0, 1, 2]);

    // Middle row
    evaluate('board = [null, null, null, "O", "O", "O", null, null, null];');
    expect(evaluate('checkWin()')).toEqual([3, 4, 5]);

    // Bottom row
    evaluate('board = [null, null, null, null, null, null, "X", "X", "X"];');
    expect(evaluate('checkWin()')).toEqual([6, 7, 8]);
  });

  test('should return correct combination for vertical win', () => {
    // Left column
    evaluate('board = ["X", null, null, "X", null, null, "X", null, null];');
    expect(evaluate('checkWin()')).toEqual([0, 3, 6]);

    // Middle column
    evaluate('board = [null, "O", null, null, "O", null, null, "O", null];');
    expect(evaluate('checkWin()')).toEqual([1, 4, 7]);

    // Right column
    evaluate('board = [null, null, "X", null, null, "X", null, null, "X"];');
    expect(evaluate('checkWin()')).toEqual([2, 5, 8]);
  });

  test('should return correct combination for diagonal win', () => {
    // Top-left to bottom-right
    evaluate('board = ["X", null, null, null, "X", null, null, null, "X"];');
    expect(evaluate('checkWin()')).toEqual([0, 4, 8]);

    // Top-right to bottom-left
    evaluate('board = [null, null, "O", null, "O", null, "O", null, null];');
    expect(evaluate('checkWin()')).toEqual([2, 4, 6]);
  });
});
