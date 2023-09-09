export class Game {
    constructor() {
        this.frame = 0;

        this.canvas = document.querySelector('canvas');
        this.canvas.width = 480;
        this.canvas.height = 640;
        this.ctx = this.canvas.getContext('2d');

        this.loop();
    }

    update() {

    }

    render() {
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    loop() {
        this.update();
        this.render();

        this.frame++;

        window.requestAnimationFrame(this.loop.bind(this));
    }
}
