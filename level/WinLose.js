const endingOverlay = document.getElementById('endingOverlay');
const endingText = document.getElementById('endingText');
const menuButton = document.getElementById('menuButton');

const endingMessage = {
    win: "Nice job! The Cheese Feast is safe!",
    lose: "Oh no! The mice crashed the Cheese Feast!<br>Give it another shot! (whiskers crossed)"
}
/**
 * Displays the winning screen with a congratulatory message
 */
export function showWinningScreen() {
    endingText.innerHTML = endingMessage.win;
    endingOverlay.style.display = 'flex';
    menuButton.style.display = 'none';
}

/**
 * Displays the losing screen with a retry encouragement message
 */
export function showLosingScreen() {
    endingText.innerHTML = endingMessage.lose;
    endingOverlay.style.display = 'flex';
    menuButton.style.display = 'none';
}