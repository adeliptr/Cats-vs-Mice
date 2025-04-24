import { StartScene } from './StartScene.js';
import { GameScene } from './GameScene.js';

let mgr;
const gameParent = document.getElementById('gameFrame');
export let startPageImage;
const catImages = {};

function preload() {
    startPageImage = loadImage('assets/start_page.jpg');
    // catImages.chefCat = loadImage('assets/ChefCat.png');
    // catImages.singleYarnCat = loadImage('assets/SingleYarnCat.png');
    // catImages.doubleYarnCat = loadImage('assets/DoubleYarnCat.png');
    // catImages.sleepyCat = loadImage('assets/SleepyCat.png');
    // catImages.iceCat = loadImage('assets/IceCat.png');
}

function setup() {
    const {width, height} = gameParent.getBoundingClientRect();
    
    const canvas = createCanvas(width, height);
    canvas.parent(gameParent);
    mgr = new SceneManager();

    mgr.addScene(StartScene);
    mgr.addScene(GameScene);
    //   mgr.addScene(PauseScene);
  
    mgr.showScene(StartScene);
}

function draw() {
    mgr.draw();
}

function mousePressed() {
  mgr.handleEvent("mousePressed");
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
