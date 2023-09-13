class SceneGameOver extends Scene {
    constructor(game, data) {
        super({ key: 'SceneGameOver' });

        this.game = game;
        this.textures = this.game.textures;
        this.canvas = this.game.canvas;
        this.ctx = this.game.ctx;
        this.ending = data.ending;
    }

    update() {
        if (this.game.KEY_ENTER_PRESSED) {
            this.game.setScene('SCENE_MAIN');
        }
    }

    render(ctx) {
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let message = '';
        let texture = null;
        if (this.ending == 'stolen') {
            texture = this.textures.STOLEN_BAG;
            message = 'THE CROWN HAS BEEN STOLEN! THE KINGDOM HAS FELL.'
        }
        else if (this.ending == 'crushed'){
            texture = this.textures.CROWN_CRUSHED;
            message = 'THE CROWN HAS BEEN CRUSHED! THE KINGDOM HAS FELL.'
        }
        ctx.drawImage(texture, (this.canvas.width / 2) - (256 / 2), (this.canvas.height / 2) - (256 / 2), 256, 256);

        this.game.fillText(message, this.canvas.width / 2, this.canvas.height * 0.75, {
            align: 'center'
        });
    }
}