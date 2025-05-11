import { catAnimation, imageAssets } from '../../sketch.js';
import { gameFrame } from '../constants/Prototype.js';
import { grid, cheeses, activeCats, activeMice, mouseGroup, throwableGroup, gameSprites } from '../scenes/GameScene.js';
import { calculateCell } from '../logic/Helper.js';
import { Yarn, Snowball } from './Throwable.js';

export const throwables = [];
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

/**
 * Cat class representing a cat character in the game
 */
class Cat {
    /**
     * Creates an iinstance of a Cat
     * 
     * @param {number} x - The x-coordinate of the cat's position
     * @param {number} y - The y-coordinate of the cat's position
     * @param {number} cost - The cost of placing the cat
     * @param {p5.SpriteSheet} spriteSheet - The sprite sheet for the cat's animations
     * @param {Object} ani - Animation details for the cat
     */
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

    /**
     * Switches the cat's animation to 'idle' state
     */
    switchToIdle() {
        this.sprite.changeAni('idle');
        this.active = false;
    }
    
    /**
     * Switches the cat's animation to 'action' state
     */
    switchToAction() {
        this.sprite.changeAni('action');
        this.active = true;
    }

    /**
     * Called when the cat is attacked by a mouse
     * @param {Object} mouse - The mouse attacking the cat
     */
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

    /**
     * Removes the cat from the game
     */
    remove() {
        this.sprite.remove();
        grid[this.row][this.col] = null;

        let index = activeCats.indexOf(this);
        if (index !== -1) {
            activeCats.splice(index, 1);
        }

        index = gameSprites.indexOf(this);
        if (index !== -1) {
            gameSprites.splice(index, 1);
        }
    }

    /**
     * Adds an explosion animation to the cat
     * SleepyCat - Red explosion when it overlaps with a mouse
     * Other Cats - Gray explosion when it is attacked by a mouse
     * @param {p5.SpriteSheet} spriteSheet - The sprite sheet for the explosion
     */
    addExplosion(spriteSheet) {
        this.explosion = createSprite(this.x, this.y, this.width, this.width);
        gameSprites.push(this.explosion);
        this.explosion.spriteSheet = spriteSheet;
        this.explosion.scale = gameFrame.catRatio;
        this.explosion.life = 90;
        this.explosion.collider = 'none';
        this.explosion.addAnis(catAniDesc.explosion);
        this.explosion.changeAni('action');
    }
}

/**
 * Cat that generates cheese periodically for resources
 */
class ChefCat extends Cat {
    constructor(x, y) {
        super(x, y, 50, catAnimation.chefCat, catAniDesc.chefCat);
        this.lastProduced = millis();
        this.offset = 0;
    }

    action() {
        // Produces 25 cheese every 10 seconds
        if (millis() - this.lastProduced > 10000) {
            const cheese = createSprite(this.x + this.width / 4 + this.offset * this.width / 20, this.y + this.width / 3 + this.offset * this.width / 20);
            cheese.scale = this.width / 216;
            cheese.image = imageAssets.cheese;
            cheese.collider = 'static';
            cheese.overlaps(mouseGroup);

            cheeses.push(cheese);
            gameSprites.push(cheese);
            this.lastProduced = millis();
            this.offset = (this.offset + 1) % 3;
        }
    }
}

/**
 * Cat that throws a single yarn at mice every 3 seconds
 */
class SingleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 100, catAnimation.singleYarnCat, catAniDesc.singleYarnCat);
        this.lastShot = millis();
    }

    action() {
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

/**
 * Cat that throws 2 yarns at mice every 3 seconds
 */
class DoubleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 200, catAnimation.doubleYarnCat, catAniDesc.doubleYarnCat);
        this.lastShot = millis();
    }

    action() {
        if (activeMice[this.row].length > 0) this.switchToAction();
        else this.switchToIdle();

        if (this.active && (millis() - this.lastShot > 3000)) {
            for (let offset of [0, 0.3 * gameFrame.tileWidth]) {
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

/**
 * Cat that activates when overlapping with a mouse and explodes, damaging the enemy by 150 points
 */
export class SleepyCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catAnimation.sleepyCat, catAniDesc.sleepyCat);
        this.awake = false;
        this.hasAttacked = false;
        this.wakeStart = undefined;
        this.targetMouse = undefined;
    }

    action(targetMouse) {
        if (this.awake) {
            this.switchToAction();
            this.addExplosion(imageAssets.redExplosion);
            this.wakeStart = millis();
            this.targetMouse = targetMouse;
            this.targetMouse.sprite.vel.x = 0;
            this.targetMouse.sprite.changeAni('idle');
            this.awake = false;
        }

        if (this.wakeStart != undefined) {
            if (!this.hasAttacked && this.targetMouse && millis() - this.wakeStart > 900) {
                const explode = { point: 150 };
                this.targetMouse.attacked(explode);
                if (this.targetMouse && this.targetMouse.HP > 0) this.targetMouse.sprite.changeAni('walk');
                this.hasAttacked = true;
            }
            if (millis() - this.wakeStart > 1480) {
                this.remove();
                this.explosion.remove();
                this.explosion = undefined;
            }
        }
    }
}

/**
 * Cat that throws snowballs at mice every 3 seconds
 */
class IceCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catAnimation.iceCat, catAniDesc.iceCat);
        this.lastShot = millis();
    }

    action() {
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

/**
 * Factory function to create different types of cats
 * @param {string} type - The type of cat to create. One of 'chefCat', 'singleYarnCat', 'doubleYarnCat', 'sleepyCat', 'iceCat'
 * @param {number} x - The x-coordinate
 * @param {number} y - The y-coordinate
 * @returns {Cat|undefined} The created cat instance or undefined if type is invalid
 */
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
            return new SleepyCat(x, y);
        case 'iceCat':
            return new IceCat(x, y);
        default:
            return undefined;
    }
}