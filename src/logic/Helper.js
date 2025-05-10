import { gameFrame } from "../constants/Prototype.js";

/**
 * Calculates the grid cell (row and column) corresponding to the given mouse coordinates
 * 
 * @param { number } mouseX - The X-coordinate of the mouse relative to the canvas
 * @param { number } mouseY - The Y-coordinate of the mouse relative to the canvas
 * @returns {{row: number, col: number}} An object containing the calculated row and column indices
 */
export function calculateCell(mouseX, mouseY) {
    let col = floor((mouseX - gameFrame.padding_left) / gameFrame.tileWidth)
    let row = floor((mouseY - gameFrame.padding_up) / gameFrame.tileHeight)
    
    return {row, col};
}

/**
 * Checks whether the specified cell coordinates are within the valid bounds the game grid
 *
 * @param {number} row - The row index of the cell to validate
 * @param {number} col - The column index of the cell to validate
 * @returns {boolean} True if the cell is within the bounds of the game grid, otherwise, false
 */
export function isCellValid(row, col) {
    if (row < 0) return false;
    if (row >= gameFrame.rows) return false;
    if (col < 0) return false;
    if (col >= gameFrame.cols) return false;
    return true;
}