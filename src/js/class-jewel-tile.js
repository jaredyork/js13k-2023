class JewelTile extends Tile {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
    }

    postInit() {
        let textures = ['RUBY', 'EMERALD', 'SAPPHIRE', 'TOPAZ'];
        this.textureKey = textures[randInt(0, textures.length - 1)];
        this.texture = this.scene.textures[this.textureKey];

        this.hp = 1;
    }

    hit() {
        if (this.hp > 0) {
            this.hp--;
        }
        else {
            this.canDestroy = true;
        }
    }
}