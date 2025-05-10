import { gameFrame } from '../constants/Prototype.js';
import { mouseAnimation } from '../sketch.js';
import { activeMice, mouseGroup, gameSprites } from '../GameScene.js';
import { updateGameProgress } from '../Controller.js';
import { Snowball } from './Throwable.js';

const mouseAniDesc = {
    idle: { row: 0, frameSize: [200, 200] },
    walk: {row: 1, frames: 6, frameSize: [200, 200], frameDelay: 10 }
}

/**
 * Mouse class representing a mouse character in the game
 */
class Mouse {
    /**
     * Creates an instance of a Mouse
     * 
     * @param {number} row - The row the mouse belongs to
     * @param {number} speed - The speed of the mouse's movement
     * @param {number} HP - The health points of the mouse
     * @param {number} AP - The attack power of the mouse
     * @param {p5.SpriteSheet} spriteSheet - The sprite sheet for the mouse animation
     * @param {number} size - The size of the mouse sprite
     */
    constructor(row, speed, HP, AP, spriteSheet, size) {
        const y = gameFrame.padding_up + row * gameFrame.tileHeight + gameFrame.tileHeight / 2;

        this.sprite = createSprite(width, y, size, size);
        this.sprite.spriteSheet = spriteSheet;
        this.sprite.scale = gameFrame.catRatio * size / gameFrame.tileWidth;
        this.sprite.overlaps(mouseGroup)
        this.sprite.addAnis(mouseAniDesc);
        this.sprite.changeAni('walk');
        this.sprite.layer = 3;
        this.sprite.vel.x = speed;

        this.row = row;
        this.HP = HP;
        this.AP = AP;
        this.targetCat = undefined;
        this.lastAttack = 0;
        this.defaultSpeed = speed;
        this.defaultHP = HP;
        this.isAlive = true;
    }
    
    /**
     * Removes the mouse from the game and updates the progress
     */
    remove() {
        this.sprite.remove();
        let index = activeMice[this.row].indexOf(this);
        if (index != -1) {
            activeMice[this.row].splice(index, 1);
        }

        if (this.defaultHP = 1000) {
            if (this.row - 1 >= 0) {
                index = activeMice[this.row - 1].indexOf(this);
                if (index != -1) activeMice[this.row - 1].splice(index, 1);
            }
            if (this.row + 1 < gameFrame.rows) {
                index = activeMice[this.row + 1].indexOf(this);
                if (index != -1) activeMice[this.row + 1].splice(index, 1);
            }
        }

        index = gameSprites.indexOf(this);
        if (index !== -1) {
            gameSprites.splice(index, 1);
        }

        if (this.isAlive) {
            this.isAlive = false;
            updateGameProgress();
        }
    }

    /**
     * Makes the mouse attack the target cat if one exists
     */
    attack() {
        if (this.targetCat != undefined) {
            this.sprite.vel.x = 0;
            this.sprite.changeAni('idle');
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

    /**
     * Handles when the mouse is attacked and reduces its health
     * @param {number} point - The damage taken by the mouse
     */
    attacked(throwable) {
        this.HP -= throwable.point;
        if (this.HP <= 0) this.remove();
        else {
            this.sprite.opacity = (this.HP / this.defaultHP) * 0.5 + 0.5;
        }

        if (throwable instanceof Snowball) {
            this.defaultSpeed = min(-0.05, this.defaultSpeed + 0.02);
            this.sprite.vel.x = this.defaultSpeed;
        }
    }
}

/**
 * Basic type of mouse
 */
class BasicMouse extends Mouse {
    constructor(row) {
        super(row, -0.15, 100, 20, mouseAnimation.basicMouse, gameFrame.tileWidth);
    }
}

/**
 * Helmet-wearing mouse
 * Has a higher HP compared to BasicMouse
 */
class HelmetMouse extends Mouse {
    constructor(row) {
        super(row, -0.15, 150, 20, mouseAnimation.helmetMouse, gameFrame.tileWidth);
    }
}

/**
 * Sporty type of mouse
 * Has a higher speed compared to Basic Mouse
 */
class SportyMouse extends Mouse {
    constructor(row) {
        super(row, -0.3, 85, 20, mouseAnimation.sportyMouse, gameFrame.tileWidth);
    }
}

/**
 * Boss mouse is 3 times bigger than other mice
 * Has a higher HP and AP compared to the other types
 * Has a slower speed compared to the other types
 */
class BossMouse extends Mouse {
    constructor(row) {
        super(row, -0.05, 1000, 50, mouseAnimation.bossMouse, 3 * gameFrame.tileWidth);
    }
}

/**
 * Factory function to create different types of cats
 * 
 * @param {string} type - The type of mouse to create
 * @param {number} row - The row the mouse belongs to
 * @returns @returns {Mouse|undefined} The created mouse instance or undefined if type is invalid
 */
function createMouse(type, row) {
    switch (type) {
        case 'basicMouse':
            return new BasicMouse(row);
        case 'helmetMouse':
            return new HelmetMouse(row);
        case 'sportyMouse':
            return new SportyMouse(row);
        case 'bossMouse':
            return new BossMouse(row);
        default:
            return undefined;
    }
}

/**
 * Spawns a mouse of a specified type and adds it to the game
 * @param {string} type - The type of mouse to spawn
 * @param {number} row - The row to spawn the mouse in
 */
export function spawnMouse(type, row) {
    let newMouse = new createMouse(type, row);
    if (newMouse) {
        activeMice[row].push(newMouse);
        if (type == 'bossMouse') {
            if (row - 1 >= 0) activeMice[row - 1].push(newMouse);
            if (row + 1 < gameFrame.rows) activeMice[row + 1].push(newMouse);
        }
        mouseGroup.add(newMouse.sprite);
        gameSprites.push(newMouse.sprite);
    }
}