import { imageAssets, selectedCatType, resetCatType } from '../../sketch.js';
import { prototypeFrame, gameFrame } from '../constants/Prototype.js';
import { Colors } from '../constants/Colors.js';
import { createCat, SleepyCat, throwables } from '../classes/Cat.js';
import { spawnMouse } from '../classes/Mouse.js';
import { drawRobotVacuums } from '../classes/RobotVacuum.js';
import { level1Mice } from '../level/Level1.js';
import { showLosingScreen } from '../level/WinLose.js';
import { updateCatButtons, updateCheeseCount, restartGameProgress } from '../logic/Controller.js';
import { calculateCell, isCellValid } from '../logic/Helper.js';

const gameParent = document.getElementById('gameFrame');
const endingOverlay = document.getElementById('endingOverlay');
const upperContainer = document.getElementById('upperContainer');
const controlPanel = document.getElementById('controlPanel');
const cheeseCount = document.getElementById('cheeseCount');
const menuButton = document.getElementById('menuButton');

export let activeCats, activeMice, robotVacuums, cheeses, grid, levelMice;
export let gameSprites = [];
export let catGroup, mouseGroup, throwableGroup;
let leftBar, rightBar, cheeseFeast;
let startTime;

export function GameScene() {
    this.enter = function() {
        select('#endingOverlay').hide();
        select('#startButton').hide();
        upperContainer.style.display = 'flex';
        menuButton.style.display = 'flex';

        resetGame();
        drawSideBars();
        drawRobotVacuums();
    }

    this.setup = function() {
        const {width, height} = gameParent.getBoundingClientRect();
        gameFrame.width = width;
        gameFrame.height = height;
    
        const ratio = width / prototypeFrame.width;
        Object.keys(prototypeFrame).forEach(key => {
            if (key != 'width' && key != 'height') {
                gameFrame[key] = ratio * prototypeFrame[key];
            }
        })

        gameFrame.catRatio = 1.2 * gameFrame.tileWidth/200;

        resizeFrame();
    }

    this.draw = function() {
        clear();
        image(imageAssets.gameBackground, 0, gameFrame.padding_up - gameFrame.border, gameFrame.width, gameFrame.height - gameFrame.padding_up + gameFrame.border);
        noFill();
        stroke(Colors.med_brown);
        strokeWeight(gameFrame.border);
        rect(gameFrame.border / 2, gameFrame.border / 2, width - gameFrame.border, height - gameFrame.border, 0.025 * width);
        updateCatButtons();
        drawGrid();

        // Spawn Mouse at the designated time
        let currTime = millis() / 1000 - startTime;

        while (levelMice.length > 0 && levelMice[0].time <= currTime) {
            const { time, type, row } = levelMice.shift();
            spawnMouse(type, row);
        }

        // Let each cat perform its action
        activeCats.forEach((cat) => cat.action());

        // Detect collision or overlaps of mice to carry out the proper interaction
        // Mouse - Cheese Feast: Game Over, the player lose the game
        // Mouse - SleepyCat: SleepyCat will explode and be removed, Mouse will be attacked
        // Mouse - other types of cats: the mouse will attack the cat
        // Mouse - RobotVacuum: RobotVacuum will be activated and removed all activeMice in its row
        // Mouse - Throwable: Mouse will be attacked by the Throwable (Yarn, Snowball)
        for (let row = 0; row < gameFrame.rows; row++) {
            for (let i = 0; i < activeMice[row].length; i++) {
                const currMouse = activeMice[row][i];
                currMouse.attack();

                if (cheeseFeast.overlaps(currMouse.sprite)) {
                    showLosingScreen();
                }

                activeCats.forEach((cat) => {
                    if (cat instanceof SleepyCat && cat.sprite.overlaps(currMouse.sprite)) {
                        cat.awake = true;
                        cat.action(currMouse);
                    }
                    else if (cat.sprite.overlaps(currMouse.sprite)) {
                        currMouse.targetCat = cat;
                    }
                })

                robotVacuums.forEach((vacuum) => {
                    if (vacuum.sprite.overlaps(currMouse.sprite)) {
                        vacuum.action();
                    }
                })

                throwables.forEach((throwable) => {
                    if (throwable.sprite.overlaps(currMouse.sprite)) {
                        currMouse.attacked(throwable);
                        throwable.remove();
                    }
                })
            }
        }
    }

    // Remove all active sprites
    this.exit = function() {
        gameSprites.forEach((sprite) => sprite.remove());
        activeCats.forEach((cat) => cat.remove());
    }

    this.mousePressed = function() {
        const {row, col} = calculateCell(mouseX, mouseY);

        // Remove an existing cat using the pet cage button
        if (isCellValid(row, col) && selectedCatType === 'petCage') {
            const cat = grid[row][col];
            if (cat) {
                cat.remove();
                const index = activeCats.indexOf(cat);
                if (index !== -1) {
                    activeCats.splice(index, 1);
                }
                grid[row][col] = null;
                resetCatType();
            }
        }

        // Placing a new cat
        else if (isCellValid(row, col) && grid[row][col] == null && selectedCatType != null) {
            let x = gameFrame.padding_left + col * gameFrame.tileWidth + gameFrame.tileWidth / 2;
            let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;
            const newCat = createCat(selectedCatType, x, y);
            if (newCat) {
                grid[row][col] = newCat;
                activeCats.push(newCat);
                catGroup.add(newCat.sprite);
                gameSprites.push(newCat.sprite);
                updateCheeseCount(-newCat.cost);
                resetCatType();
            }
        }
        
        // Detecting click on cheese to collect it and update the cheeseCount
        for (let i = 0; i < cheeses.length; i++) {
            // Calculate boundaries of the cheese
            let left = cheeses[i].x - cheeses[i].width / 2;
            let right = cheeses[i].x + cheeses[i].width / 2;
            let top = cheeses[i].y - cheeses[i].height / 2;
            let bottom = cheeses[i].y + cheeses[i].height / 2;

            if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                updateCheeseCount(25);
                cheeses[i].remove();
                cheeses.splice(i, 1);
                break;
            }
        }

    }
}

/**
 * Resizes and styles UI containers and game canvas based on screen width
 */
function resizeFrame() {
    gameParent.style.borderRadius = (0.03125 * width) + 'px';
    canvas.style.borderRadius = (0.03125 * width) + 'px';
    endingOverlay.style.borderRadius = (0.03125 * width) + 'px';

    const gridHeight = gameFrame.rows * gameFrame.tileHeight;
    upperContainer.style.width = width + 'px';
    upperContainer.style.height = (gameFrame.height - gridHeight - gameFrame.border) + 'px';
    upperContainer.style.borderRadius = (0.03125 * width) + 'px' + (0.03125 * width) + 'px 0 0';

    controlPanel.style.margin = gameFrame.border + 'px';
    controlPanel.style.marginRight = 0;
    controlPanel.style.height = (gameFrame.height - gridHeight - 3 * gameFrame.border) + 'px';
}

/**
 * Resets all game state variables and reinitializes the game board
 */
function resetGame() {
    gameSprites.forEach((sprite) => sprite.remove());
    activeCats = [];
    activeMice = Array.from({ length: 5 }, () => []);
    gameSprites = [];
    robotVacuums = [];
    cheeses = [];
    grid = Array(5).fill().map(() => Array(9).fill(null));
    levelMice = [...level1Mice];
    restartGameProgress();

    startTime = millis() / 1000;
    cheeseCount.textContent = 50;

    catGroup = new Group();
    mouseGroup = new Group();
    throwableGroup = new Group();
}

/**
 * Draws the tile grid on the game canvas
 * Applies hover feedback based on selected cat type and grid cell state
 */
function drawGrid() {
    for (let row = 0; row < gameFrame.rows; row++) {
        for (let col = 0; col < gameFrame.cols; col++) {
            let x = gameFrame.padding_left + col * gameFrame.tileWidth;
            let y = gameFrame.padding_up + row * gameFrame.tileHeight;

            let isHovering = (
                mouseX > x && mouseX < x + gameFrame.tileWidth &&
                mouseY > y && mouseY < y + gameFrame.tileHeight
            );
            
            // Highlight the hovered grid if any action is possible with the currently selected button (selectedCatType)
            if (isHovering && selectedCatType && selectedCatType === 'petCage' && grid[row][col] != null) {
                fill(Colors.med_brown);
            }
            else if (isHovering && selectedCatType && selectedCatType != 'petCage' && grid[row][col] == null) {
                fill(Colors.med_brown);
            }
            else fill((row + col) % 2 === 0 ? Colors.dark_yellow : Colors.light_yellow);

            noStroke();
            rect(x, y, gameFrame.tileWidth, gameFrame.tileHeight);
        }
    }
}

/**
 * Draws the left and right borders and the cheeseFeast loss-detection area
 */
function drawSideBars() {
    // Drawn so that the Mouse and RobotVacuum goes under the border
    leftBar = createSprite(gameFrame.border / 2, gameFrame.padding_up + gameFrame.tileHeight * 2.5, gameFrame.border, gameFrame.tileHeight * 5);
    leftBar.color = Colors.med_brown;
    leftBar.layer = 10;
    leftBar.overlaps(allSprites);
    gameSprites.push(leftBar);

    // Drawn so that the Mouse and RobotVacuum goes under the border
    rightBar = createSprite(width - gameFrame.border / 2, gameFrame.padding_up + gameFrame.tileHeight * 2.5, gameFrame.border, gameFrame.tileHeight * 5);
    rightBar.color = Colors.med_brown;
    rightBar.layer = 10;
    rightBar.overlaps(allSprites);
    gameSprites.push(rightBar);

    // Drawn to detect loss
    cheeseFeast = createSprite(gameFrame.tileWidth / 4, gameFrame.padding_up + gameFrame.tileHeight * 2.5, gameFrame.tileWidth / 2, gameFrame.tileHeight * 5);
    cheeseFeast.opacity = 0;
    cheeseFeast.overlaps(mouseGroup);
    gameSprites.push(cheeseFeast)
}