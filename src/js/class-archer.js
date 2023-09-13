class Archer extends Person {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
        this.hasGravity = true;
        this.direction = 1;
        this.attackCooldownDelay = 10;

        this.bowAnim = {
            maxFrames: 4,
            frame: 0,
            delay: 5,
            tick: 0
        };

        this.bowScaleX = 1;
        this.bowScaleY = 1;
    }

    kill() {
        this.isLiving = false;
        this.canDestroy = true;
    }

    postInit() {
        this.headTexture = this.scene.textures.ARCHER_HEAD;
        this.chestTexture = this.scene.textures.ARCHER_CHEST;
        this.pantsTexture = this.scene.textures.ARCHER_PANTS;

        this.attackCooldownLeft = this.attackCooldownDelay;
        console.log('ATTACK COOLDOWN LEFT: ', this.attackCooldownLeft);

        super.postInit();
    }

    update() {
        this.baseUpdate();

        this.scaleX = this.direction;

        this.bowAnim = this.updateAnimation(this.bowAnim);
    }

    renderAfterBaseRender(ctx) {
        console.log('rendering bow', this.bowAnim.frame * 8, 0, (this.x * 16), (this.y * 16), this.bowScaleX, this.bowScaleY);
        ctx.drawImage(this.scene.textures.BOW, this.bowAnim.frame * 8, 0, 8, 8, (this.x * 16), (this.y * 16), 8 * this.bowScaleX, 8 * this.bowScaleY);
    }
}