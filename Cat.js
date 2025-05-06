import { gameFrame } from './prototype.js';
import { catAnimation, imageAssets } from './sketch.js';
import { cheeses } from './GameScene.js';

export const movingObjects = [];
export const catAniDesc = {
    chefCat: {
        idle: { row: 0, frames: 4, frameSize: [200, 200], frameDelay: 10 },
        action: { row: 0, frames: 4, frameSize: [200, 200], frameDelay: 10 }
    },
    singleYarnCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 5 }
    },
    doubleYarnCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 5 }
    },
    sleepyCat: {
        idle: {row: 0, frameSize: [200, 200] },
        action: {row: 0, frameSize: [200, 200] }
    },
    iceCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 5 }
    }
}

export class Cat {
    constructor(x, y, cost, spriteSheet, ani, width) {
        // (x, y) is the center of the grid
        this.sprite = createSprite(x, y, width, width);
        this.sprite.spriteSheet = spriteSheet;
        this.sprite.addAnis(ani);
        console.log(this.spriteSheet);
        console.log(this.sprite.animation);
        this.sprite.changeAni('idle');

        this.x = x;
        this.y = y;
        this.cost = cost;
        this.ani = ani;
        this.width = width;
        this.HP = 200;
    }

    switchToIdle() {
        this.sprite.changeAni('idle');
    }
    
    switchToAction() {
        this.sprite.changeAni('action');
    }

    action() {
        // TODO:
        // - ChefCat: produces cheese every 10 seconds -> cheese.png pop up on top of the ChefCat every 10 seconds
        // - SingleYarnCat: throw a yarn every 3 seconds -> a sprite of yarn.png shows up on the right of the cat with velocity of 1 to the right,
        //                 delete the sprite of yarn when yarn hit a mouse or get out of the gameFrame
        // - DoubleYarnCat: similar to SingleYarnCat but throw 2 yarns every 3 seconds, the yarns are visibly detached from each other
        // - SleepyCat: stay idle until collide with a mouse, when colliding, change ani into 'wake_up' and then remove the sleepyCat sprite
        // - IceCat: throw a snowball every 3 seconds from its mouth, the snowball is a sprite with image snowball.png
        //         delete the snowball sprite when it hit a mouse or get out of gameFrame
    }

    update() {
        // update ani
        clear();
        if (kb.presses('a')) {
            console.log(`a is pressed`)
            this.sprite.changeAni('action');
        }
    }

    attacked(mouse) {
        this.HP = max(0, this.HP - mouse.AP);
        // if HP = 0, remove sprite
    }

    draw() {
        drawSprite(this.sprite);
        // animation(this.ani, this.x, this.y, 0, this.width, this.width);
    }

    collide() {
        //
    }

    changeAni(name) {
        this.sprite.changeAni(name);
    }

    remove() {
        this.sprite.remove();
    }
}

export class ChefCat extends Cat {
    constructor(x, y) {
        super(x, y, 50, catAnimation.chefCat, catAniDesc.chefCat, 100);
        this.lastProduced = millis();
    }

    action() {
        // Produces 50 cheese every 10 seconds, cheese.png pop in front of the chefCat
        // TODO: change it to 25 secs
        if (millis() - this.lastProduced > 10000) {
            console.log(`produces Cheese!`)
            const cheese = createSprite(this.x + this.width / 5, this.y + this.width / 5);
            cheese.scale = this.width / 300;
            cheese.image = imageAssets.cheese;
            cheese.mouseActive = true;
            cheeses.push(cheese);
            this.lastProduced = millis();
        }
    }
}

export class SingleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 100, catAnimation.singleYarnCat, catAniDesc.singleYarnCat, 100);
        this.lastShot = millis();
    }

    action() {
        // Throw yarn every 3 seconds -> yarn has velocity x of 1 (to the right)
        if (millis() - this.lastShot > 3000) {
            const yarn = createSprite(this.x + gameFrame.tileWidth / 2, this.y, 20, 20);
            yarn.addImage(imageAssets.yarn);
            yarn.vel.x = 1;
            yarn.life = 600;
            movingObjects.push(yarn);
            this.lastShot = millis();
        }
    }
}

export class DoubleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 200, catAnimation.doubleYarnCat, catAniDesc.doubleYarnCat, 100);
        this.lastShot = millis();
    }

    action() {
        // Throw 2 yarns every 3 seconds -> yarn has velocity x of 1 (to the right)
        if (millis() - this.lastShot > 3000) {
            for (let offset of [0, 20]) {   // change to the actual yarn size, not 20
                const yarn = createSprite(this.x + gameFrame.tileWidth / 2 + offset, this.y, 20, 20);
                yarn.addImage(imageAssets.yarn);
                yarn.vel.x = 1;
                yarn.life = 600;
                movingObjects.push(yarn);
            }
            this.lastShot = millis();
        }
    }
}

export class SleepyCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catAnimation.sleepyCat, catAniDesc.sleepyCat, 100);
        this.awake = false;
        this.wakeStart = undefined;
    }

    action() {
        if (this.awake && !this.wakeStart) {
            this.changeAni('wake_up');
            this.wakeStart = millis();
        }
        if (this.wakeStart && millis() - this.wakeStart > 1000) {
            this.remove();
            // Still needs to remove it from the activeCats or grid[row][col]
        }
    }
}

export class IceCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catAnimation.iceCat, catAniDesc.iceCat, 100);
        this.lastShot = millis();
    }

    action() {
        // Throw snowball every 3 seconds -> snowball has velocity x of 1 (to the right)
        if (millis() - this.lastShot > 3000) {
            const snowball = createSprite(this.x, this.y, 20, 20);
            snowball.addImage(imageAssets.snowball);
            snowball.vel.x = 1;
            snowball.life = 600;
            movingObjects.push(snowball);
            this.lastShot = millis();
        }
    }
}