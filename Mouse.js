import { gameFrame } from './prototype.js';
import { imageAssets } from './sketch.js';

export class Mice {
    constructor(x, y, speed, HP, AP, img, width) {
        this.sprite = createSprite(x, y, width, width);
        this.sprite.image = img;
        this.sprite.layer = 3;
        this.sprite.velocity.x = speed;
        this.HP = HP;
        this.AP = AP;
        this.width = width;
    }
    
    remove() {
        this.sprite.remove();
    }
}

export class BasicMouse extends Mice {
    constructor(x, y) {
        super(x, y, -0.25, 100, 20, imageAssets.mouse, gameFrame.tileWidth);
    }
}

export class HelmetMouse extends Mice {
    constructor(x, y) {
        super(x, y, -0.25, 150, 20, imageAssets.mouse, gameFrame.tileWidth);
    }
}