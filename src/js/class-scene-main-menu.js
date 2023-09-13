class SceneMainMenu extends Scene {
    constructor(game) {
        super({ key: 'SceneMainMenu' });

        this.game = game;
        this.textures = this.game.textures;

        this.game = game;
        this.canvas = this.game.canvas;
        this.ctx = this.game.ctx;
    }

    update() {
        if (this.game.KEY_ENTER_PRESSED) {
            this.game.setScene('SCENE_MAIN');
        }
    }

    render(ctx) {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.drawImage(this.textures.TITLE, 0, (this.canvas.height * 0.5) - (this.canvas.width * 0.5), this.game.canvas.width, this.game.canvas.width);
    }
}