class CrownTile extends Tile {
    constructor(x, y) {
        super({
            x: x,
            y: y
        });
    }

    postInit() {
        this.textureKey = 'CROWN';
        this.texture = this.scene.textures[this.textureKey];

        this.hp = 1;
    }

    hit() {
        if (this.hp > 0) {
            this.hp--;
        }
        else {
            this.scene.startGameOver('stolen');
            this.canDestroy = true;
        }
    }
}