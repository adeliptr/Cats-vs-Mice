class Cat {
    constructor(x, y, cost, image, width) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.image = image;
        this.width = width;
        this.interval = 500;
        this.HP = 200;
    }

    attacked(mouse) {
        this.HP = max(0, this.HP - mouse.AP);
    }

    draw() {
        image(this.image, this.x, this.y, this.width, this.height);
    }
}

class ChefCat extends Cat {
    constructor(x, y) {
        super(x, y, 50, catImages.chefCat, 100);
    }

    update() {

    }
}

class SingleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 100, catImages.singleYarnCat, 100);
        this.lastShot = 0;
    }
}

class DoubleYarnCat extends Cat {
    constructor(x, y) {
        super(x, y, 200, catImages.doubleYarnCat, 100);
        this.lastShot;
    }
}

class SleepyCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catImages.sleepyCat, 100);
    }
}

class IceCat extends Cat {
    constructor(x, y) {
        super(x, y, 150, catImages.iceCat, 100);
        this.lastShot = 0;
    }
}