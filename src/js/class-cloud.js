import Entity from './class-entity.js';

class Cloud extends Entity {
    constructor(x, y) {
        super(x, y);
        this.velocity.x = -randArb(0.05, 0.3);
        this.width = 32;
        this.height = 16;
        this.scale = 32 * Math.abs(this.velocity.x);
        this.width *= this.scale;
        this.height *= this.scale;
        this.hasGravity = false;
        this.depth = -2;
    }

    render(ctx) {
        ctx.drawImage(this.scene.textures.CLOUD0, this.x, this.y, this.width, this.height);
    }
}
