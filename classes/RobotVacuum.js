import { gameFrame } from '../constants/Prototype.js';
import { imageAssets } from '../sketch.js';
import { activeMice, catGroup, throwableGroup, gameSprites, robotVacuums } from '../GameScene.js';

export class RobotVacuum {
    constructor(x, y, row) {
        this.sprite = createSprite(x, y, gameFrame.robotSize, gameFrame.robotSize)
        this.sprite.image = imageAssets.robotVacuum;
        this.sprite.scale = gameFrame.tileWidth / 1000;
        this.sprite.layer = 2;
        this.sprite.overlaps(catGroup);
        this.sprite.overlaps(throwableGroup);
        
        this.activated = false;
        this.row = row;
    }

    // If activated, kills all the active mice in its row
    action() {
        if (!this.activated) {
            this.activated = true;
            this.sprite.vel.x = 2;
        }
        
        for (let i = 0; i < activeMice[this.row].length; i++) {
            let currMouse = activeMice[this.row][i];
            if (this.sprite.overlaps(currMouse.sprite)) {
                activeMice[this.row].splice(i, 1);
                currMouse.remove();
            }
        }
    }

}

/**
 * Draws 1 vacuum robot on each row at the bginning of the game
 */
export function drawRobotVacuums() {
    for (let row = 0; row < gameFrame.rows; row ++) {
        let x = gameFrame.paddingRobot + gameFrame.robotSize / 2;
        let y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;

        let vacuum = new RobotVacuum(x, y, row);

        gameSprites.push(vacuum.sprite);
        robotVacuums.push(vacuum);
    }
}