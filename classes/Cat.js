import { gameFrame } from '../constants/Prototype.js';
import { catAnimation, imageAssets } from '../sketch.js';
import { grid, cheeses, activeCats, activeMice, calculateCell, mouseGroup, throwableGroup, catGroup } from '../GameScene.js';
import { Yarn, Snowball } from './Throwable.js';

export const throwables = [];
export const sleepyCats = [];
const catAniDesc = {
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
    explosion: {
        action: {row: 0, frames: 9, frameSize: [200, 200], frameDelay: 10 }
    },
    iceCat: {
        idle: { row: 0, frameSize: [200, 200] },
        action: {row: 1, frames: 8, frameSize: [200, 200], frameDelay: 22 }
    }
}

class Cat {
    constructor(x, y, cost, spriteSheet, ani) {
        // (x, y) is the center of the grid
        this.width = 1.2 * gameFrame.tileWidth;
        this.sprite = createSprite(x, y, this.width, this.width);
        this.sprite.spriteSheet = spriteSheet;
        this.sprite.scale = gameFrame.catRatio;
        this.sprite.addAnis(ani);
        this.sprite.collider = 'static';
        this.sprite.overlaps(throwableGroup);
        this.sprite.layer = 1;
        this.sprite.changeAni('idle');
        this.active = false;
        this.explosion = undefined;

        this.x = x;
        this.y = y;
        this.cost = cost;
        this.ani = ani;
        this.HP = 100;

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

    attacked(mouse) {
        this.addExplosion(imageAssets.grayExplosion);
        this.explosion = undefined;
        this.HP -= mouse.AP;
        setTimeout(() => {
            if (this.HP <= 0) {
                this.remove();
                mouse.targetCat = undefined;
            }
            else {
                this.sprite.opacity = (this.HP / 100) * 0.7 + 0.3;
            }
        }, 1500);
    }

    changeAni(name) {
        this.sprite.changeAni(name);
    }

    remove() {
        this.sprite.remove();
        grid[this.row][this.col] = null;

        const index = activeCats.indexOf(this);
        if (index !== -1) {
            activeCats.splice(index, 1);
        }
    }

    addExplosion(spriteSheet) {
        this.explosion = createSprite(this.x, this.y, this.width, this.width);
        this.explosion.spriteSheet = spriteSheet;
        this.explosion.scale = gameFrame.catRatio;
        this.explosion.life = 90;
        this.explosion.collider = 'none';
        this.explosion.addAnis(catAniDesc.explosion);
        this.explosion.changeAni('action');
        // this.explosion.overlaps(mouseGroup);
        // this.explosion.overlaps(catGroup);
    }
}

class ChefCat extends Cat {
    constructor(x, y) {
        super(x, y, 50, catAnimation.chefCat, catAniDesc.chefCat);
        this.lastProduced = millis();
        this.offset = 0;
    }

    action() {
        // Produces 25 cheese every 10 seconds, cheese.png pop in front of the chefCat
        if (millis() - this.lastProduced > 10000) {
            console.log(`produces Cheese!`)
            const cheese = createSprite(this.x + this.width / 4 + this.offset * this.width / 20, this.y + this.width / 3 + this.offset * this.width / 20);
            cheese.scale = this.width / 216;
            cheese.image = imageAssets.cheese;
            cheese.collider = 'static';
            cheese.overlaps(mouseGroup);
            cheeses.push(cheese);
            this.lastProduced = millis();
            this.offset = (this.offset + 1) % 3;
        }
    }
}

class SingleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 100, catAnimation.singleYarnCat, catAniDesc.singleYarnCat);
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

class DoubleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 200, catAnimation.doubleYarnCat, catAniDesc.doubleYarnCat);
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

class SleepyCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catAnimation.sleepyCat, catAniDesc.sleepyCat);
        this.awake = false;
        this.wakeStart = undefined;
        this.targetMouse = undefined;
    }

    action(targetMouse) {
        if (this.awake) {
            this.changeAni('action');
            this.addExplosion(imageAssets.redExplosion);
            this.wakeStart = millis();
            this.targetMouse = targetMouse;
            this.targetMouse.sprite.vel.x = 0;
            this.targetMouse.sprite.changeAni('idle');
            this.awake = false;
        }

        if (this.wakeStart != undefined) {
            if (millis() - this.wakeStart > 900) {
                if (this.targetMouse) this.targetMouse.remove();
            }
            if (millis() - this.wakeStart > 1480) {
                this.remove();
                this.explosion.remove();
                this.explosion = undefined;
            }
        }
    }
}

class IceCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catAnimation.iceCat, catAniDesc.iceCat);
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

export function createCat(type, x, y) {
    switch (type) {
        case 'chefCat':
            const chefCat = new ChefCat(x, y);
            chefCat.action();
            return chefCat;
        case 'singleYarnCat':
            return new SingleYarnCat(x, y);
        case 'doubleYarnCat':
            return new DoubleYarnCat(x, y);
        case 'sleepyCat':
            const sleepyCat = new SleepyCat(x, y);
            if (sleepyCat) sleepyCats.push(sleepyCat);
            return sleepyCat;
        case 'iceCat':
            return new IceCat(x, y);
        default:
            return undefined;
    }
}