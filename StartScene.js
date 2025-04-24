import { GameScene } from './GameScene.js';
import { startPageImage } from './sketch.js';

export function StartScene() {
    this.enter = function() {
        select('#controlPanel').hide();
        select('#menuButton').hide();
        
        const startButton = select('#startButton');
        startButton.show();
        
        startButton.mousePressed(() => {
            this.sceneManager.showScene(GameScene);
        });
    }
    this.draw = function() {
        console.log(`StartScene width: ${width} and length: ${height}`)
        image(startPageImage, 0, 0, width, height);
    }
}