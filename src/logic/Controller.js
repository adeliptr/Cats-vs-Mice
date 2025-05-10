import { level1Mice } from '../level/Level1.js';
import { showWinningScreen } from '../level/WinLose.js';

const cheeseCount = document.getElementById('cheeseCount');
const gameProgress = document.getElementById('gameProgress');
const catCosts = {
    chefCat: 50,
    singleYarnCat: 100,
    doubleYarnCat: 200,
    sleepyCat: 150,
    iceCat: 150
};
let miceKilled = 0;

/**
 * Updates the player's cheese count by n
 * 
 * @param { number } n - The amount of cheese to add (can be negative)
 */
export function updateCheeseCount(n) {
    let currCheese = parseInt(cheeseCount.textContent);
    currCheese += n;
    cheeseCount.textContent = currCheese;
}

/**
 * Enables or disables cat selection buttons based on the current cheese count
 * Buttons will be disabled if the player cannot afford the corresponding cat
 */
export function updateCatButtons() {
    document.querySelectorAll('.catButton').forEach(button => {
        const catType = button.id;
        const cost = catCosts[catType];

        if (parseInt(cheeseCount.textContent) < cost) {
            button.disabled = true;
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.5';
        }
        else {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    })
}

export function restartGameProgress() {
    miceKilled = 0;
}

/**
 * Updates the game progress bar based on the number of mice killed
 * If all mice are killed, the win screen is triggered
 */
export function updateGameProgress() {
    miceKilled++;
    const percentage = Math.floor((miceKilled / level1Mice.length) * 100);
    gameProgress.value = percentage;

    if (percentage >= 100) {
        showWinningScreen();
    }
}