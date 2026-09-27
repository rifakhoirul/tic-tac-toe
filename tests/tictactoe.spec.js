const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Tic Tac Toe E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local index.html file
    const filePath = `file://${path.resolve(__dirname, '../index.html')}`;
    await page.goto(filePath);
  });

  test('should display the initial board state and UI components', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Tic Tac Toe');
    await expect(page.locator('#status')).toHaveText("X's turn");

    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(9);
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toBeEmpty();
    }

    await expect(page.locator('.score-x')).toHaveText('0');
    await expect(page.locator('.score-o')).toHaveText('0');
    await expect(page.locator('.score-draw')).toHaveText('0');

    await expect(page.locator('#resetBtn')).toBeVisible();
  });

  test('should allow a standard game flow where a player wins', async ({ page }) => {
    const cells = page.locator('.cell');

    // X wins: 0, 1, 2
    await cells.nth(0).click(); // X
    await expect(page.locator('#status')).toHaveText("O's turn");

    await cells.nth(3).click(); // O
    await expect(page.locator('#status')).toHaveText("X's turn");

    await cells.nth(1).click(); // X
    await expect(page.locator('#status')).toHaveText("O's turn");

    await cells.nth(4).click(); // O
    await expect(page.locator('#status')).toHaveText("X's turn");

    await cells.nth(2).click(); // X

    // Check win status
    await expect(page.locator('#status')).toHaveText("X wins!");
    await expect(page.locator('.score-x')).toHaveText('1');

    // Check that further clicks don't change the board
    await cells.nth(8).click();
    await expect(cells.nth(8)).toBeEmpty();
  });

  test('should allow a game flow resulting in a draw', async ({ page }) => {
    const cells = page.locator('.cell');

    // Draw sequence:
    // X: 0, 1, 5, 6, 8
    // O: 2, 3, 4, 7
    await cells.nth(0).click(); // X
    await cells.nth(2).click(); // O
    await cells.nth(1).click(); // X
    await cells.nth(3).click(); // O
    await cells.nth(5).click(); // X
    await cells.nth(4).click(); // O
    await cells.nth(6).click(); // X
    await cells.nth(7).click(); // O
    await cells.nth(8).click(); // X

    await expect(page.locator('#status')).toHaveText("It's a draw!");
    await expect(page.locator('.score-draw')).toHaveText('1');
  });

  test('should reset the game when New Game button is clicked', async ({ page }) => {
    const cells = page.locator('.cell');

    // Play a few moves
    await cells.nth(0).click(); // X
    await cells.nth(4).click(); // O

    await expect(cells.nth(0)).toHaveText('X');
    await expect(cells.nth(4)).toHaveText('O');
    await expect(page.locator('#status')).toHaveText("X's turn");

    // Reset game
    await page.locator('#resetBtn').click();

    // Verify reset
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toBeEmpty();
    }
    await expect(page.locator('#status')).toHaveText("X's turn");

    // Scores should be preserved
    await expect(page.locator('.score-x')).toHaveText('0');
    await expect(page.locator('.score-o')).toHaveText('0');
    await expect(page.locator('.score-draw')).toHaveText('0');
  });
});
