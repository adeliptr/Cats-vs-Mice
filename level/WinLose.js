const endingOverlay = document.getElementById('endingOverlay');
const endingText = document.getElementById('endingText');

const endingMessage = {
    win: "Nice job! The Cheese Feast is safe!",
    lose: "Oh no! The mice crashed the Cheese Feast!<br>Give it another shot! (whiskers crossed)"
}

export function showWinningScreen() {
    endingText.innerHTML = endingMessage.win;
    endingOverlay.style.display = 'flex';
}

export function showLosingScreen() {
    endingText.innerHTML = endingMessage.lose;
    endingOverlay.style.display = 'flex';
}