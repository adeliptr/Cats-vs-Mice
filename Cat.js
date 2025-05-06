import { gameFrame } from './prototype.js';
import { catAnimation, imageAssets } from './sketch.js';
import { grid, cheeses, activeMice, calculateCell, mouseGroup, throwableGroup } from './GameScene.js';
import { Yarn, Snowball } from './Throwable.js';

export const throwables = [];
export const catAniDesc = {
    chefCat: {
        idle: { row: 0, frames: 4, frameSize: [200, 200], frameDelay: 10 },
        action: { row: 0, frames: 4, frameSize: [200, 200], frameDelay: 10 }
    },
    singleYarnCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 22 }
    },
    doubleYarnCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 22 }
    },
    sleepyCat: {
        idle: {row: 0, frames: 6, frameSize: [200, 200], frameDelay: 20 },
        action: {row: 1, frames: 9, frameSize: [200, 200], frameDelay: 10 }
    },
    iceCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 22 }
    }
}

export class Cat {
    constructor(x, y, cost, spriteSheet, ani, width) {
        // (x, y) is the center of the grid
        this.sprite = createSprite(x, y, width, width);
        this.sprite.spriteSheet = spriteSheet;
        this.sprite.addAnis(ani);
        this.sprite.collider = 'static';
        this.sprite.collides(mouseGroup);
        this.sprite.overlaps(throwableGroup);
        this.sprite.layer = 1;
        this.sprite.changeAni('idle');
        this.active = false;

        this.x = x;
        this.y = y;
        this.cost = cost;
        this.ani = ani;
        this.width = width;
        this.HP = 200;

        const { row, col } = calculateCell(x, y);
        this.row = row;
        this.col = col;
    }

    switchToIdle() {
        this.sprite.changeAni('idle');
        this.active = false;
    }
    
    switchToAction() {
        this.sprite.changeAni('action');
        this.active = true;
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

    // draw() {
    //     drawSprite(this.sprite);
    //     // animation(this.ani, this.x, this.y, 0, this.width, this.width);
    // }

    collide() {
        //
    }

    changeAni(name) {
        this.sprite.changeAni(name);
    }

    remove() {
        this.sprite.remove();
        grid[this.row][this.col] = null;
    }
}

export class ChefCat extends Cat {
    constructor(x, y) {
        super(x, y, 50, catAnimation.chefCat, catAniDesc.chefCat, 100);
        this.lastProduced = millis();
    }

    action() {
        // Produces 25 cheese every 10 seconds, cheese.png pop in front of the chefCat
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
        if (activeMice[this.row].length > 0) this.switchToAction();
        else this.switchToIdle();

        if (this.active && (millis() - this.lastShot > 3000)) {
            let yarnX = this.x + gameFrame.tileWidth / 2;
            let yarnY = this.y;

            const yarn = new Yarn(yarnX, yarnY);
            if (yarn) {
                throwables.push(yarn);
                throwableGroup.add(yarn.sprite);
            }

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

        if (activeMice[this.row].length > 0) this.switchToAction();
        else this.switchToIdle();

        if (this.active && (millis() - this.lastShot > 3000)) {
            // TODO: check on the offset again
            for (let offset of [0, 20]) {
                let yarnX = this.x + gameFrame.tileWidth / 2 + offset;
                let yarnY = this.y;

                const yarn = new Yarn(yarnX, yarnY);
                if (yarn) {
                    throwables.push(yarn);
                    throwableGroup.add(yarn.sprite);
                }
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
        this.targetMouse = undefined;
    }

    action(targetMouse) {
        if (this.awake) {
            this.changeAni('action');
            this.wakeStart = millis();
            this.targetMouse = targetMouse;
            this.awake = false;
        }

        if (this.wakeStart != undefined) {
            if (millis() - this.wakeStart > 900) {
                if (this.targetMouse) this.targetMouse.remove();
            }
            if (millis() - this.wakeStart > 1480) this.remove();
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

        if (activeMice[this.row].length > 0) this.switchToAction();
        else this.switchToIdle();

        if (this.active && (millis() - this.lastShot > 3000)) {
            const snowballX = this.x + gameFrame.tileWidth / 2;
            const snowballY = this.y;

            const snowball = new Snowball(snowballX, snowballY)
            if (snowball) {
                throwables.push(snowball);
                throwableGroup.add(snowball.sprite);
            }

            this.lastShot = millis();
        }
    }
}