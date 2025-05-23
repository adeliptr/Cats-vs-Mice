import { imageAssets } from '../../sketch.js';
import { gameFrame } from '../constants/Prototype.js';
import { gameSprites } from '../scenes/GameScene.js';

export class Throwable {
    constructor(x, y, point, img, width) {
        this.sprite = createSprite(x, y, width, width);
        gameSprites.push(this.sprite);
        this.sprite.image = img;
        this.sprite.scale = gameFrame.tileWidth / 1024;
        this.sprite.vel.x = 1;
        this.sprite.rotationSpeed = 1;
        this.sprite.life = 600;
        
        this.point = point;
        this.width = width;
    }

    remove() {
        this.sprite.remove();
    }
}

// Yarn is thrown by singleYarnCat and doubleYarnCat
export class Yarn extends Throwable {
    constructor(x, y) {
        super(x, y, 15, imageAssets.yarn, gameFrame.tileWidth / 4);
    }
}

// Snowball is thrown by IceCat
export class Snowball extends Throwable {
    constructor(x, y) {
        super(x, y, 8, imageAssets.snowball, gameFrame.tileWidth / 4);
    }
}