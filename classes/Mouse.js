import { gameFrame } from '../constants/Prototype.js';
import { mouseAnimation } from '../sketch.js';
import { activeMice, mouseGroup } from '../GameScene.js';

const mouseAniDesc = {
    idle: { row: 0, frameSize: [200, 200] },
    walk: {row: 1, frames: 6, frameSize: [200, 200], frameDelay: 10 }
}

class Mouse {
    constructor(x, y, row, speed, HP, AP, spriteSheet, width) {
        this.sprite = createSprite(x, y, width, width);
        this.sprite.spriteSheet = spriteSheet;
        this.sprite.scale = gameFrame.catRatio * width / gameFrame.tileWidth;
        this.sprite.overlaps(mouseGroup)
        this.sprite.addAnis(mouseAniDesc);
        this.sprite.changeAni('walk');
        this.sprite.layer = 3;
        this.sprite.vel.x = speed;
        this.row = row;
        this.HP = HP;
        this.AP = AP;
        this.width = width;
        this.targetCat = undefined;
        this.lastAttack = 0;
        this.defaultSpeed = speed;
        this.defaultHP = HP
    }
    
    remove() {
        this.sprite.remove();
        const index = activeMice[this.row].indexOf(this);
        if (index != -1) {
            activeMice[this.row].splice(index, 1);
        }
    }

    attack() {
        if (this.targetCat != undefined) {
            this.sprite.vel.x = 0;
            this.sprite.changeAni('idle');
            console.log(`I have a target Cat, and its HP is ${this.targetCat.HP}`)
            if (this.lastAttack == 0 || millis() - this.lastAttack > 3000) {
                this.targetCat.attacked(this);
                this.lastAttack = millis();
            }
        }
        else {
            this.sprite.vel.x = this.defaultSpeed;
            this.sprite.changeAni('walk');
        }
    }

    attacked(point) {
        this.HP -= point;
        if (this.HP <= 0) this.remove();
        else {
            this.sprite.opacity = (this.HP / this.defaultHP) * 0.5 + 0.5;
        }
    }
}

class BasicMouse extends Mouse {
    constructor(x, y, row) {
        super(x, y, row, -0.15, 100, 20, mouseAnimation.basicMouse, gameFrame.tileWidth);
    }
}

class HelmetMouse extends Mouse {
    constructor(x, y, row) {
        super(x, y, row, -0.15, 150, 20, mouseAnimation.helmetMouse, gameFrame.tileWidth);
    }
}

class SportyMouse extends Mouse {
    constructor(x, y, row) {
        super(x, y, row, -0.25, 75, 20, mouseAnimation.sportyMouse, gameFrame.tileWidth);
    }
}

class BossMouse extends Mouse {
    constructor(x, y, row) {
        super(x, y, row, -0.05, 500, 50, mouseAnimation.bossMouse, 3 * gameFrame.tileWidth);
    }
}

export function createMouse(type, x, y, row) {
    switch (type) {
        case 'basicMouse':
            return new BasicMouse(x, y, row);
        case 'helmetMouse':
            return new HelmetMouse(x, y, row);
        case 'sportyMouse':
            return new SportyMouse(x, y, row);
        case 'bossMouse':
            return new BossMouse(x, y, row);
        default:
            return undefined;
    }
}