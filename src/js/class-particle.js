class Particle extends Entity {
    constructor(args = {}) {
        super(args.x, args.y);

        this.animData = {
            maxFrames: args.texture.width / args.frameWidth,
            frame: 0,
            frameWidth: args.frameWidth,
            frameHeight: args.frameHeight,
            delay: args.animDelay,
            destroyWhenComplete: true
        };
        this.texture = args.texture;
        this.timeLeft = args.timeLeft;
        this.scale = 1;
        this.growRate = args.growRate === undefined ? 0 : args.growRate;
        this.depth = 1;
    }

    update() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        }

        this.animData = this.updateAnimation(this.animData);

        this.scale += this.growRate;
    }

    render(ctx) {
        ctx.drawImage(this.texture, this.animData.frame * this.animData.frameWidth, 0, this.animData.frameWidth, this.animData.frameHeight, this.x, this.y, this.animData.frameWidth * this.scale, this.animData.frameHeight * this.scale);
    }
}
