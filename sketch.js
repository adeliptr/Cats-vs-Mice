import { StartScene } from './StartScene.js';
import { GameScene } from './GameScene.js';

export let mgr;
const gameParent = document.getElementById('gameFrame');
const controlPanel = document.getElementById('controlPanel');
const startButton = document.getElementById('startButton');
export let startPageAni, robotVacuum, gameBackground;
export let imageAssets = {};
export const catImages = {};
export const catAnimation = {};
export let selectedCatType = null;

function preload() {
    startPageAni = loadAni('assets/start_page_ani.png', {
        width: 1440, height: 1024, frames: 5
    });
    startPageAni.frameDelay = 10;
    robotVacuum = loadImage('assets/robot_vacuum.png');
    gameBackground = loadImage('assets/gamebg3.png');

    imageAssets.cheese = loadImage('assets/cheese.png');
    imageAssets.yarn = loadImage('assets/yarn.png');
    imageAssets.snowball = loadImage('assets/snowball.png');
    imageAssets.robotVacuum = loadImage('assets/robot_vacuum.png');
    imageAssets.gameBackground = loadImage('assets/gamebg3.png');
    imageAssets.mouse = loadImage('assets/mouse.png');

    catImages.chefCat = loadImage('assets/chef_cat_icon.png');
    catImages.singleYarnCat = loadImage('assets/single_yarn_cat_icon.png');
    catImages.doubleYarnCat = loadImage('assets/double_yarn_cat_icon.png');
    catImages.sleepyCat = loadImage('assets/sleepy_cat_icon.png');
    catImages.iceCat = loadImage('assets/ice_cat_icon.png');

    catAnimation.chefCat = loadImage('assets/chef_cat_ani.png');
    catAnimation.singleYarnCat = loadImage('assets/single_yarn_cat_ani.png');
    catAnimation.doubleYarnCat = loadImage('assets/double_yarn_cat_ani.png');
    catAnimation.sleepyCat = loadImage('assets/sleepy_cat_ani.png');
    catAnimation.iceCat = loadImage('assets/ice_cat_ani.png');

    // catAnimation.chefCat = loadAni('assets/chef_cat_ani.png', {
    //     width: 200, height: 200, frames: 4
    // });
    // catAnimation.singleYarnCat = loadAni('assets/single_yarn_cat_ani.png', {
    //     width: 200, height:200, frames: 8
    // });
    // catAnimation.doubleYarnCat = loadAni('assets/double_yarn_cat_ani.png', {
    //     width: 200, height: 200, frames: 8
    // });
    // catAnimation.iceCat = loadAni('assets/ice_cat_ani.png', {
    //     width: 200, height: 200, frames: 8
    // });
    
    // catAnimation.chefCat.frameDelay = 10;
    // catAnimation.singleYarnCat.frameDelay = 5;
    // catAnimation.doubleYarnCat.frameDelay = 30;
    // catAnimation.iceCat.frameDelay = 5;
}

function setup() {
    const {width, height} = gameParent.getBoundingClientRect();
    
    const canvas = createCanvas(width, height);
    canvas.parent(gameParent);
    mgr = new SceneManager();

    mgr.addScene(StartScene);
    mgr.addScene(GameScene);
    //   mgr.addScene(PauseScene);
  
    mgr.showScene(GameScene);
}

function draw() {
    mgr.draw();
}

function mousePressed() {
  mgr.handleEvent("mousePressed");
}

export function resetCatType() {
    console.log(`reset is called`)
    selectedCatType = null;
    document.querySelectorAll('.catButton').forEach(button =>
        button.classList.remove('activeButton')
    );
}

startButton.addEventListener('click', function (event) {
    event.preventDefault();
    mgr.showScene(GameScene);
});

menuButton.addEventListener('click', function (event) {
    event.preventDefault();
    mgr.showScene(StartScene);
});

document.querySelectorAll('.catButton').forEach(button => {
    button.addEventListener('click', () => {
        if (selectedCatType === button.id) {
            selectedCatType = null;
            button.classList.remove('activeButton');
            // document.body.style.cursor = 'default';
        }
        else {
            selectedCatType = button.id;
            document.querySelectorAll('.catButton').forEach(btn =>
                btn.classList.remove('activeButton')
            );
            button.classList.add('activeButton');
            // const img = button.querySelector('img');
            // if (img) {
            //     document.body.style.cursor = `url(${img.src}) 32 32, auto`;
            // }
        }
        console.log('Selected cat type:', selectedCatType);
    });
});

  

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
