import { gameFrame } from '../constants/Prototype.js';
import { imageAssets } from '../sketch.js';
import { activeMice, catGroup, throwableGroup } from '../GameScene.js';

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