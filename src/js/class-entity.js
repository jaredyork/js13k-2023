class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.hasGravity = true;
        this.canDestroy = false;
        this.depth = 0;
    }

    updateAnimation(animData) {
        animData.destroyWhenComplete === undefined ? false : animData.destroyWhenComplete;

        if (animData.tick < animData.delay) {
            animData.tick++;
        }
        else {
            if (animData.frame < animData.maxFrames - 1) {
                animData.frame++;
            }
            else {
                if (animData.destroyWhenComplete) {
                    this.canDestroy = true;
                }

                animData.frame = 0;
            }
            animData.tick = 0;
        }

        return animData;
    }

    baseUpdate() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    update() {

    }
}