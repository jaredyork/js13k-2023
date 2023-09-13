class BrickTile extends Tile {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
    }

    hit() {
        console.log('HIT BRICK');
        if (this.hp > 0) {
            this.hp--;
        }
        else {
            this.canDestroy = true;
        }
    }

    postInit() {
        let textures = ['BRICK0', 'BRICK1'];
        this.textureKey = textures[randInt(0, textures.length - 1)];
        this.texture = this.scene.textures[this.textureKey];

        this.hp = 10;
    }
}
