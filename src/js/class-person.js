class Person extends Tile {
    constructor(args = {}) {
        super(args);

        this.direction = 1;
        this.scaleX = 1;
        this.scaleY = 1;

        this.isLiving = true;

        this.accessories = [];
    }

    getAccessory(name) {
        for (let i = 0; i < this.accessories.length; i++) {
            if (this.accessories[i].name == name) {
                return this.accessories[i];
            }
        }
        return null;
    }

    postInit() {
        this.width = 8;
        this.height = 16;

        this.headFrameWidth = 9;
        this.headFrameHeight = 8;

        this.chestFrameWidth = 7;
        this.chestFrameHeight = this.chestTexture.height;
        this.chestAnim = {
            maxFrames: this.chestTexture.width / this.chestFrameWidth,
            frame: 0,
            delay: 5,
            tick: 0
        };

        this.pantsFrameWidth = 7;
        this.pantsFrameHeight = this.pantsTexture.height;
        this.pantsAnim = {
            maxFrames: this.pantsTexture.width / this.pantsFrameWidth,
            frame: 0,
            delay: 5,
            tick: 0
        };
    }

    updateAnimation(animData) {
        if (animData.tick < animData.delay) {
            animData.tick++;
        }
        else {
            if (animData.frame < animData.maxFrames - 1) {
                animData.frame++;
            }
            else {
                animData.frame = 0;
            }
            animData.tick = 0;
        }

        return animData;
    }

    baseUpdate() {
        this.chestAnim = this.updateAnimation(this.chestAnim);
        this.pantsAnim = this.updateAnimation(this.pantsAnim);

        this.scaleX = this.direction;
    }

    update() {
        this.baseUpdate();
    }

    render(ctx) {
        ctx.save();

        ctx.drawImage(this.pantsTexture, this.pantsAnim.frame * this.pantsFrameWidth, 0, this.pantsFrameWidth, this.pantsFrameHeight, (this.x * 16) + 1, (this.y * 16) + 11, this.pantsFrameWidth, this.pantsFrameHeight);

        ctx.drawImage(this.chestTexture, this.chestAnim.frame * this.chestFrameHeight, 0, this.chestFrameWidth, this.chestFrameHeight, (this.x * 16) + 1, (this.y * 16) + 5, this.chestFrameWidth, this.chestFrameHeight);

        ctx.drawImage(this.headTexture, (this.x * 16) - 4, this.y * 16, this.headTexture.width, this.headTexture.height);

        ctx.restore();
    }
}

