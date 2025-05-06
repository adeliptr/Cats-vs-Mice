import { prototypeFrame, gameFrame } from './prototype.js';
import { imageAssets, catImages, catAnimation, selectedCatType, resetCatType } from './sketch.js';
import { Cat, ChefCat, SingleYarnCat, DoubleYarnCat, SleepyCat, IceCat } from './Cat.js';
import { Mice, BasicMouse, HelmetMouse } from './Mouse.js';
import { level1Mice } from './level/level1.js';
import { RobotVacuum } from './RobotVacuum.js';

const gameParent = document.getElementById('gameFrame');
const upperContainer = document.getElementById('upperContainer');
const controlPanel = document.getElementById('controlPanel');
const cheeseCount = document.getElementById('cheeseCount');
const activeCats = [];
export const activeMice = Array.from({ length: 5 }, () => []);
let robotVacuums = [];
let gameSprites = [];
let sleepyCats = [];
export let cheeses = [];
export let grid = Array(5).fill().map(() => Array(9).fill(null));
let startTime;
let levelMice = [...level1Mice];

function createCat(type, x, y) {
    switch (type) {
        case 'chefCat':
            let cat = new ChefCat(x, y);
            cat.action();
            return cat;
        case 'singleYarnCat':
            return new SingleYarnCat(x, y);
        case 'doubleYarnCat':
            return new DoubleYarnCat(x, y);
        case 'sleepyCat':
            return new SleepyCat(x, y);
        case 'iceCat':
            return new IceCat(x, y);
        default:
            return undefined;
    }
}

function createMouse(type, x, y) {
    switch (type) {
        case 'basicMouse':
            return new BasicMouse(x, y);
        case 'helmetMouse':
            return new HelmetMouse(x, y);
        default:
            return undefined;
    }
}

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
        select('#menuButton').show();
        select('#startButton').hide();

        upperContainer.style.width = width + 'px';
        const gridHeight = gameFrame.rows * gameFrame.tileHeight;
        upperContainer.style.height = (gameFrame.height - gridHeight - gameFrame.border) + 'px';

        controlPanel.style.margin = gameFrame.border + 'px';
        controlPanel.style.height = (gameFrame.height - gridHeight - 3 * gameFrame.border) + 'px';

        gameSprites = [];   // kayanya ga butuh, sama kayak allSprites
        robotVacuums = [];

        for (let row = 0; row < gameFrame.rows; row ++) {
            let x = gameFrame.paddingRobot + gameFrame.robotSize / 2;
            let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;

            let vacuum = new RobotVacuum(x, y, row);

            gameSprites.push(vacuum);
            robotVacuums.push(vacuum);
        }

        startTime = millis() / 1000;
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
    }

    this.draw = function() {
        clear();
        image(imageAssets.gameBackground, 0, gameFrame.padding_up - gameFrame.border, gameFrame.width, gameFrame.height - gameFrame.padding_up + gameFrame.border);
        noFill();
        stroke('#B09472');
        strokeWeight(gameFrame.border);
        // fix the border radius --> create a ratio for it
        rect(gameFrame.border / 2, gameFrame.border / 2, width - gameFrame.border, height - gameFrame.border, 35);
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
                sleepyCats.forEach((cat) => {
                    if (cat.sprite.overlaps(currMouse.sprite)) {
                        cat.awake = true;
                        cat.action(currMouse);
                        activeMice[row].splice(i, 1);
                    }
                })

                robotVacuums.forEach((vacuum) => {
                    if (vacuum.sprite.overlaps(currMouse.sprite)) {
                        vacuum.action();
                    }
                })
            }
        }
    }

    this.exit = function() {
        console.log(`i exit gameScene`);
        gameSprites.forEach((sprite) => sprite.remove());
        activeCats.forEach((cat) => cat.remove());  // idk if it is needed or not
    }

    this.mousePressed = function() {
        const {row, col} = calculateCell(mouseX, mouseY);

        if (isCellValid(row, col) && selectedCatType === 'petCage') {
            const cat = grid[row][col];
            if (cat) {
                cat.remove();
                // TODO: need to remove from activeCats too
                const index = activeCats.indexOf(cat);
                if (index !== -1) {
                    activeCats.splice(index, 1);
                }
                grid[row][col] = null;
            }
        }

        else if (isCellValid(row, col) && selectedCatType != null) {
            let x = gameFrame.padding_left + col * gameFrame.tileWidth + gameFrame.tileWidth / 2;
            let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;
            const newCat = createCat(selectedCatType, x, y);
            if (newCat) {
                newCat.sprite.scale = gameFrame.catRatio;
                grid[row][col] = newCat;
                activeCats.push(newCat);
                gameSprites.push(newCat.sprite); // Is this redundant? kedouble2
                if (newCat instanceof SleepyCat) sleepyCats.push(newCat);
                resetCatType();
            }
            // grid[row][col] = selectedCatType;
            // console.log(`after click, grid[${row}][${col}] = ${grid[row][col]}`)
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

                if (isHovering && selectedCatType) {
                    fill('red');
                }
                else {
                    fill((row + col) % 2 === 0 ? '#F7E7BE' : '#FDF4E5');
                }
                noStroke();
                rect(x, y, gameFrame.tileWidth, gameFrame.tileHeight);
            }
        }
    }
}

function updateCheeseCount(n) {
    console.log(`update cheeseCount by ${n}`)
    let currCheese = int(cheeseCount.textContent);
    currCheese += n;
    cheeseCount.textContent = currCheese;
    // TODO: handle if n is negative and currCheese < -n somewhere else
}

function spawnMouse(type, row) {
    let x = width;
    let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;

    let newMouse = new createMouse(type, x, y);
    if (newMouse) {
        newMouse.sprite.scale = gameFrame.catRatio;
        activeMice[row].push(newMouse);
        gameSprites.push(newMouse.sprite); // Is this redundant? kedouble2 sama allSprites
    }
}