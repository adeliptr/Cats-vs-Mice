import { StartScene } from './src/scenes/StartScene.js';
import { GameScene } from './src/scenes/GameScene.js';

export let mgr;
export let startPageAni;
export const imageAssets = {};
export const catAnimation = {};
export const mouseAnimation = {};
export let selectedCatType = null;

const gameParent = document.getElementById('gameFrame');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const quitButton = document.getElementById('quitButton');
const quitGameButton = document.getElementById('quitGameButton');

function preload() {
    // Load all images and animations
    startPageAni = loadAni('assets/start_page_ani.png', {
        width: 1440, height: 1024, frames: 5
    });
    startPageAni.frameDelay = 10;

    imageAssets.cheese = loadImage('assets/cheese.png');
    imageAssets.yarn = loadImage('assets/yarn.png');
    imageAssets.snowball = loadImage('assets/snowball.png');
    imageAssets.robotVacuum = loadImage('assets/robot_vacuum.png');
    imageAssets.gameBackground = loadImage('assets/game_background.png');
    imageAssets.redExplosion = loadImage('assets/red_explosion.png');
    imageAssets.grayExplosion = loadImage('assets/gray_explosion.png');

    catAnimation.chefCat = loadImage('assets/cat/chef_cat_ani.png');
    catAnimation.singleYarnCat = loadImage('assets/cat/single_yarn_cat_ani.png');
    catAnimation.doubleYarnCat = loadImage('assets/cat/double_yarn_cat_ani.png');
    catAnimation.sleepyCat = loadImage('assets/cat/sleepy_cat_ani.png');
    catAnimation.iceCat = loadImage('assets/cat/ice_cat_ani.png');

    mouseAnimation.basicMouse = loadImage('assets/mouse/basic_mouse_ani.png');
    mouseAnimation.helmetMouse = loadImage('assets/mouse/helmet_mouse_ani.png');
    mouseAnimation.sportyMouse = loadImage('assets/mouse/sporty_mouse_ani.png');
    mouseAnimation.bossMouse = loadImage('assets/mouse/boss_mouse_ani.png');
}

function setup() {
    // Set the canvas to #gameFrame
    const {width, height} = gameParent.getBoundingClientRect();
    
    const canvas = createCanvas(width, height);
    canvas.parent(gameParent);
    mgr = new SceneManager();

    mgr.addScene(StartScene);
    mgr.addScene(GameScene);
  
    mgr.showScene(StartScene);
}

function draw() {
    mgr.draw();
}

function mousePressed() {
  mgr.handleEvent("mousePressed");
}

/**
 * Reset selectedCatType to null
 */
export function resetCatType() {
    selectedCatType = null;
    document.querySelectorAll('.catButton').forEach(button =>
        button.classList.remove('activeButton')
    );
}

// Add event listener to the buttons
startButton.addEventListener('click', function (event) {
    event.preventDefault();
    mgr.showScene(GameScene);
});

restartButton.addEventListener('click', function (event) {
    event.preventDefault();
    mgr.showScene(GameScene);
});

quitButton.addEventListener('click', function (event) {
    event.preventDefault();
    mgr.showScene(StartScene);
});

quitGameButton.addEventListener('click', function (event) {
    event.preventDefault();
    mgr.showScene(StartScene);
});

document.querySelectorAll('.catButton').forEach(button => {
    button.addEventListener('click', () => {
        if (selectedCatType === button.id) {
            selectedCatType = null;
            button.classList.remove('activeButton');
        }
        else {
            selectedCatType = button.id;
            document.querySelectorAll('.catButton').forEach(btn =>
                btn.classList.remove('activeButton')
            );
            button.classList.add('activeButton');
        }
    });
});

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
