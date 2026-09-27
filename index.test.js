const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Tic Tac Toe - handleClick', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;
  });

  const getCells = () => document.querySelectorAll('.cell');

  test('clicking an empty cell should update the board and switch player', () => {
    // Initial state
    expect(getCells()[0].textContent).toBe('');
    expect(document.getElementById('status').textContent).toBe("X's turn");

    // Click first cell
    getCells()[0].click();

    // Check if DOM updated
    expect(getCells()[0].textContent).toBe('X');
    expect(getCells()[0].classList.contains('taken')).toBe(true);
    expect(getCells()[0].classList.contains('x')).toBe(true);

    // Check if player switched
    expect(document.getElementById('status').textContent).toBe("O's turn");
  });

  test('clicking a taken cell should not update anything', () => {
    // Player X clicks first cell
    getCells()[0].click();
    expect(getCells()[0].textContent).toBe('X');
    expect(document.getElementById('status').textContent).toBe("O's turn");

    // Player O tries to click the same cell
    getCells()[0].click();

    // State should remain unchanged
    expect(getCells()[0].textContent).toBe('X');
    expect(document.getElementById('status').textContent).toBe("O's turn");
    // Other cells should remain empty
    expect(getCells()[1].textContent).toBe('');
  });

  test('clicking when game is over should not update anything', () => {
    // Simulate X winning
    getCells()[0].click(); // X
    getCells()[3].click(); // O
    getCells()[1].click(); // X
    getCells()[4].click(); // O
    getCells()[2].click(); // X wins

    expect(document.getElementById('status').textContent).toBe('X wins!');

    // Try to click another cell
    getCells()[5].click();

    // Cell should not update
    expect(getCells()[5].textContent).toBe('');
  });

  test('game over and score update when a player wins', () => {
    // Simulate X winning
    getCells()[0].click(); // X
    getCells()[3].click(); // O
    getCells()[1].click(); // X
    getCells()[4].click(); // O
    getCells()[2].click(); // X wins

    // Check status text
    const status = document.getElementById('status');
    expect(status.textContent).toBe('X wins!');

    // Check winning cells are highlighted
    expect(getCells()[0].classList.contains('win')).toBe(true);
    expect(getCells()[1].classList.contains('win')).toBe(true);
    expect(getCells()[2].classList.contains('win')).toBe(true);

    // Check score updated
    const scoreX = document.querySelector('.score-x');
    expect(scoreX.textContent).toBe('1');
  });

  test('game over and score update on a draw', () => {
    // Simulate a draw
    // X O X
    // X O O
    // O X X
    getCells()[0].click(); // X
    getCells()[1].click(); // O
    getCells()[2].click(); // X
    getCells()[4].click(); // O
    getCells()[3].click(); // X
    getCells()[5].click(); // O
    getCells()[7].click(); // X
    getCells()[6].click(); // O
    getCells()[8].click(); // X

    // Check status text
    const status = document.getElementById('status');
    expect(status.textContent).toBe("It's a draw!");

    // Check score updated
    const scoreDraw = document.querySelector('.score-draw');
    expect(scoreDraw.textContent).toBe('1');

    // No cells should be highlighted as win
    getCells().forEach(cell => {
      expect(cell.classList.contains('win')).toBe(false);
    });
  });
});
