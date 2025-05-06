import { gameFrame } from './prototype.js';
import { imageAssets } from './sketch.js';
import { activeMice } from './GameScene.js';

export class Mouse {
    constructor(x, y, row, speed, HP, AP, img, width) {
        this.sprite = createSprite(x, y, width, width);
        this.sprite.image = img;
        this.sprite.layer = 3;
        this.sprite.velocity.x = speed;
        this.row = row;
        this.HP = HP;
        this.AP = AP;
        this.width = width;
    }
    
    remove() {
        this.sprite.remove();
        const index = activeMice[this.row].indexOf(this);
        if (index != -1) {
            activeMice[this.row].splice(index, 1);
        }
        // console.log(`there are now ${activeMice[this.row].length} mice in row ${this.row}`)
    }

    attacked(point) {
        this.HP -= point;
        if (this.HP <= 0) this.remove();
    }
}

export class BasicMouse extends Mouse {
    constructor(x, y, row) {
        super(x, y, row, -0.25, 100, 20, imageAssets.mouse, gameFrame.tileWidth);
    }
}

export class HelmetMouse extends Mouse {
    constructor(x, y, row) {
        super(x, y, row, -0.25, 150, 20, imageAssets.mouse, gameFrame.tileWidth);
    }
}