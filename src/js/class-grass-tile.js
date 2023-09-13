class GrassTile extends Tile {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
    }

    postInit() {
        this.texture = this.scene.textures.GRASS;
    }
}
