class Knight extends Person {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
        this.hasGravity = true;
        this.direction = 1;
        this.attackCooldownDelay = 10;
        this.scaleX = 1;
        this.scaleY = 1;
    }

    kill() {
        this.isLiving = false;
        this.canDestroy = true;
    }

    postInit() {
        this.headTexture = this.scene.textures.KNIGHT_HEAD;
        this.chestTexture = this.scene.textures.KNIGHT_CHEST;
        this.pantsTexture = this.scene.textures.KNIGHT_PANTS;

        this.attackCooldownLeft = this.attackCooldownDelay;
        console.log('ATTACK COOLDOWN LEFT: ', this.attackCooldownLeft);

        super.postInit();
    }

    update() {
        this.baseUpdate();

        this.scaleX = this.direction;
    }
}