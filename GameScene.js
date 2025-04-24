import { prototypeFrame, gameFrame } from './prototype.js';
import { StartScene } from './StartScene.js';

const gameParent = document.getElementById('gameFrame');

export function GameScene() {
    this.enter = function() {
        select('#controlPanel').show();
        select('#menuButton').show();
        select('#startButton').hide();
    }

    this.setup = function() {
        const {width, height} = gameParent.getBoundingClientRect();
        gameFrame.width = width;
        gameFrame.height = height;
    
        const ratio = width / prototypeFrame.width;
        gameFrame.tileWidth = ratio * prototypeFrame.tileWidth
        gameFrame.tileHeight = ratio * prototypeFrame.tileHeight
        gameFrame.padding_left = ratio * prototypeFrame.padding_left
    }

    this.draw = function() {
        console.log(`lets draw the gameScene`)
        background(255);
        textAlign(CENTER, CENTER);
        textSize(40);
        fill(0);
        text("this is the game", width/2, height/2 - 50);
        drawGrid()
    }

    this.mousePressed = function() {
        this.sceneManager.showScene(StartScene);
    }

    function drawGrid() {
        for (let row = 0; row < gameFrame.rows; row++) {
            for (let col = 0; col < gameFrame.cols; col++) {
                let x = gameFrame.padding_left + col * gameFrame.tileWidth;
                let y = gameFrame.padding_left + row * gameFrame.tileHeight;
                fill((row + col) % 2 === 0 ? '#fceecf' : '#fff6e9');
                stroke(0);
                // console.log(`rect(${x}, ${y}, ${gameFrame.tileWidth}, ${gameFrame.tileHeight})`)
                rect(x, y, gameFrame.tileWidth, gameFrame.tileHeight);
            }
        }
    }
}