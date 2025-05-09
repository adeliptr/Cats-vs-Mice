import { prototypeFrame, gameFrame } from './constants/Prototype.js';
import { Colors } from './constants/Colors.js';
import { imageAssets, selectedCatType, resetCatType } from './sketch.js';
import { createCat, SleepyCat, sleepyCats, throwables } from './classes/Cat.js';
import { createMouse } from './classes/Mouse.js';
import { RobotVacuum } from './classes/RobotVacuum.js';
import { level1Mice } from './level/Level1.js';
import { showWinningScreen, showLosingScreen } from './level/WinLose.js';

const gameParent = document.getElementById('gameFrame');
const upperContainer = document.getElementById('upperContainer');
const controlPanel = document.getElementById('controlPanel');
const cheeseCount = document.getElementById('cheeseCount');
const gameProgress = document.getElementById('gameProgress');
export const activeCats = [];
export const activeMice = Array.from({ length: 5 }, () => []);
const robotVacuums = [];
let leftBar, rightBar, cheeseFeast;
export let gameSprites = [];
export let cheeses = [];
export let grid = Array(5).fill().map(() => Array(9).fill(null));
let startTime;
let levelMice = [...level1Mice];
export let miceKilled = 0;
export let catGroup, mouseGroup, throwableGroup, cheeseGroup;

export function calculateCell(mouseX, mouseY) {
    let col = floor((mouseX - gameFrame.padding_left) / gameFrame.tileWidth)
    let row = floor((mouseY - gameFrame.padding_up) / gameFrame.tileHeight)
    
    return {row, col};
}

function isCellValid(row, col) {
    if (row < 0) return false;
    if (row >= gameFrame.rows) return false;
    if (col < 0) return false;
    if (col >= gameFrame.cols) return false;
    return true;
}

export function GameScene() {
    this.enter = function() {
        select('#upperContainer').show();
        select('#endingOverlay').hide();
        select('#menuButton').show();
        select('#startButton').hide();

        upperContainer.style.width = width + 'px';
        const gridHeight = gameFrame.rows * gameFrame.tileHeight;
        upperContainer.style.height = (gameFrame.height - gridHeight - gameFrame.border) + 'px';

        controlPanel.style.margin = gameFrame.border + 'px';
        controlPanel.style.height = (gameFrame.height - gridHeight - 3 * gameFrame.border) + 'px';

        gameSprites = [];   // kayanya ga butuh, sama kayak allSprites

        leftBar = createSprite(gameFrame.border / 2, gameFrame.padding_up + gameFrame.tileHeight * 2.5, gameFrame.border, gameFrame.tileHeight * 5);
        leftBar.color = Colors.dark_brown;
        leftBar.layer = 10;
        leftBar.overlaps(allSprites);
        gameSprites.push(leftBar);

        rightBar = createSprite(width - gameFrame.border / 2, gameFrame.padding_up + gameFrame.tileHeight * 2.5, gameFrame.border, gameFrame.tileHeight * 5);
        rightBar.color = Colors.dark_brown;
        rightBar.layer = 10;
        rightBar.overlaps(allSprites);
        gameSprites.push(rightBar);

        cheeseFeast = createSprite(gameFrame.tileWidth / 4, gameFrame.padding_up + gameFrame.tileHeight * 2.5, gameFrame.tileWidth / 2, gameFrame.tileHeight * 5);
        cheeseFeast.opacity = 0;
        cheeseFeast.overlaps(mouseGroup);
        gameSprites.push(cheeseFeast)

        for (let row = 0; row < gameFrame.rows; row ++) {
            let x = gameFrame.paddingRobot + gameFrame.robotSize / 2;
            let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;

            let vacuum = new RobotVacuum(x, y, row);

            gameSprites.push(vacuum.sprite);
            robotVacuums.push(vacuum);
        }

        startTime = millis() / 1000;
        cheeseCount.textContent = 50;
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

        catGroup = new Group();
        mouseGroup = new Group();
        throwableGroup = new Group();
        cheeseGroup = new Group();
    }

    this.draw = function() {
        clear();
        image(imageAssets.gameBackground, 0, gameFrame.padding_up - gameFrame.border, gameFrame.width, gameFrame.height - gameFrame.padding_up + gameFrame.border);
        noFill();
        stroke(Colors.dark_brown);
        strokeWeight(gameFrame.border);
        // fix the border radius --> create a ratio for it
        rect(gameFrame.border / 2, gameFrame.border / 2, width - gameFrame.border, height - gameFrame.border, 35);
        updateCatButtons();
        drawGrid();

        let currTime = millis() / 1000 - startTime;

        while (levelMice.length > 0 && levelMice[0].time <= currTime) {
            const { time, type, row } = levelMice.shift();
            spawnMouse(type, row);
        }

        activeCats.forEach((cat) => cat.action());


        for (let row = 0; row < gameFrame.rows; row++) {
            for (let i = 0; i < activeMice[row].length; i++) {
                const currMouse = activeMice[row][i];
                currMouse.attack();

                if (cheeseFeast.overlaps(currMouse.sprite)) {
                    showLosingScreen();
                }

                sleepyCats.forEach((cat) => {
                    if (cat.sprite.overlaps(currMouse.sprite)) {
                        cat.awake = true;
                        cat.action(currMouse);
                    }
                })

                activeCats.forEach((cat) => {
                    if (!(cat instanceof SleepyCat) && cat.sprite.overlaps(currMouse.sprite)) {
                        currMouse.targetCat = cat;
                        console.log(`seting targetCat to ${currMouse.targetCat}`);
                    }
                })

                robotVacuums.forEach((vacuum) => {
                    if (vacuum.sprite.overlaps(currMouse.sprite)) {
                        vacuum.action();
                    }
                })

                throwables.forEach((throwable) => {
                    if (throwable.sprite.overlaps(currMouse.sprite)) {
                        currMouse.attacked(throwable.point);
                        throwable.remove();
                    }
                })
            }
        }
    }

    this.exit = function() {
        console.log(`i exit gameScene`);
        console.log(allSprites);
        gameSprites.forEach((sprite) => sprite.remove());
        activeCats.forEach((cat) => cat.remove());  // idk if it is needed or not
    }

    this.mousePressed = function() {
        const {row, col} = calculateCell(mouseX, mouseY);

        if (isCellValid(row, col) && selectedCatType === 'petCage') {
            const cat = grid[row][col];
            if (cat) {
                cat.remove();
                const index = activeCats.indexOf(cat);
                if (index !== -1) {
                    activeCats.splice(index, 1);
                }
                grid[row][col] = null;
            }
        }

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

        for (let i = 0; i < cheeses.length; i++) {
            console.log(`there are ${cheeses.length} cheeses`)
            // Calculate boundaries
            let left = cheeses[i].x - cheeses[i].width / 2;
            let right = cheeses[i].x + cheeses[i].width / 2;
            let top = cheeses[i].y - cheeses[i].height / 2;
            let bottom = cheeses[i].y + cheeses[i].height / 2;

            if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                console.log(`cheese ${i} is pressed`)
                updateCheeseCount(25);
                cheeses[i].remove();
                cheeses.splice(i, 1);
                break;
            }
        }

    }

    function drawGrid() {
        for (let row = 0; row < gameFrame.rows; row++) {
            for (let col = 0; col < gameFrame.cols; col++) {
                let x = gameFrame.padding_left + col * gameFrame.tileWidth;
                let y = gameFrame.padding_up + row * gameFrame.tileHeight;

                let isHovering = (
                    mouseX > x && mouseX < x + gameFrame.tileWidth &&
                    mouseY > y && mouseY < y + gameFrame.tileHeight
                );
                
                if (isHovering && selectedCatType && selectedCatType === 'petCage' && grid[row][col] != null) fill('red');
                else if (isHovering && selectedCatType && selectedCatType != 'petCage' && grid[row][col] == null) fill('red');
                else fill((row + col) % 2 === 0 ? Colors.dark_yellow : Colors.light_yellow);

                noStroke();
                rect(x, y, gameFrame.tileWidth, gameFrame.tileHeight);
            }
        }
    }
}

function updateCheeseCount(n) {
    let currCheese = int(cheeseCount.textContent);
    currCheese += n;
    cheeseCount.textContent = currCheese;
}

function spawnMouse(type, row) {
    let x = width;
    let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;
    
    let newMouse = new createMouse(type, x, y, row);
    if (newMouse) {
        activeMice[row].push(newMouse);
        if (type == 'bossMouse') {
            if (row - 1 >= 0) activeMice[row - 1].push(newMouse);
            if (row + 1 < gameFrame.rows) activeMice[row + 1].push(newMouse);
        }
        mouseGroup.add(newMouse.sprite);
        gameSprites.push(newMouse.sprite);
    }
}

export function updateProgressBar() {
    miceKilled++;
    const percentage = Math.floor((miceKilled / level1Mice.length) * 100);
    gameProgress.value = percentage;

    if (percentage >= 100) {
        showWinningScreen();
    }
    console.log(`killed ${miceKilled} out of ${level1Mice.length}, % = ${percentage}`);
}

const catCosts = {
    chefCat: 50,
    singleYarnCat: 100,
    doubleYarnCat: 200,
    sleepyCat: 150,
    iceCat: 150
};

function updateCatButtons() {
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