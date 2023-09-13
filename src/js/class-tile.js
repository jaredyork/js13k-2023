class Tile {
    constructor(args = {}) {
        console.log('BASE TILE CREATED: ', args);
        this.lastX = args.x;
        this.lastY = args.y;
        this.x = args.x;
        this.y = args.y;
        this.width = 16;
        this.height = 16;
        this.scale = 1;
        this.velocity = { x: 0, y: 0 };
        this.isPlaced = true;
        this.isPlacing = false;
        this.isFalling = false;
        this.positionHistory = [];
        this.isLiving = false;
        this.isBg = false;
        this.canDestroy = false;
        this.hp = 999999;
        this.texture = args.texture;
    }

    basePostInit() {
        this.moveTo(this.x, this.y);
    }

    moveTo(x, y) {
        this.positionHistory.push({ x: x, y: y });
        this.lastX = this.x;
        this.lastY = this.y;
        this.x = x;
        this.y = y;
        try {
            this.scene.bgTilemap[this.lastX][this.lastY] = null;
            this.scene.tilemap[this.lastX][this.lastY] = null;
        }
        catch {
            console.log('Failed to set last X and Y at ', this.lastX, this.lastY);
        }
        if (this.isBg) {
            this.scene.bgTilemap[x][y] = this;
        }
        else {
            this.scene.tilemap[x][y] = this;
        }
    }

    render(ctx) {
        if (this.isBg) {
            this.scale = 2;
        }
        else {
            this.scale = 1;
        }

        this.width = 16 * this.scale;
        this.height = 16 * this.scale;
        let offset = {
            x: - (this.width - 16) * 0.5,
            y: - (this.height - 16) * 0.5
        };

        if (this.texture) {
            ctx.drawImage(this.texture, (this.x * 16) + offset.x, (this.y * 16) + offset.y, this.width, this.height);
        }
    }
}