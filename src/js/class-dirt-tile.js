class DirtTile extends Tile {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
    }

    postInit() {
        let textures = ['DIRT'];
        let texture = textures[randInt(0, textures.length - 1)];
        this.texture = this.scene.textures[texture];
    }
}
