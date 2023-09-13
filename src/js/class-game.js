class Game {
    constructor() {
        console.log('STARTING GAME');
        this.scenes = {
            SCENE_MAIN_MENU: SceneMainMenu,
            SCENE_MAIN: SceneMain,
            SCENE_GAME_OVER: SceneGameOver
        };
        this.currentScene = [];

        this.canvas = document.querySelector('canvas');
        this.canvas.width = 640;
        this.canvas.height = 960;
        
        console.log('MAP SIZE: ', this.mapWidth, this.mapHeight);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;

        this.textures = {
            TITLE: 'title',
            ARROW_GUI: 'arrow-gui',
            CLOUD0: 'cloud0',
            GRASS: 'grass',
            DIRT: 'dirt',
            BRICK0: 'brick0',
            BRICK1: 'brick1',
            CROWN: 'crown',
            RUBY: 'ruby',
            EMERALD: 'emerald',
            SAPPHIRE: 'sapphire',
            TOPAZ: 'topaz',
            KNIGHT_HEAD: 'knight-head',
            KNIGHT_CHEST: 'knight-chest',
            KNIGHT_PANTS: 'knight-pants',
            ARCHER_HEAD: 'archer-head',
            ARCHER_CHEST: 'archer-chest',
            ARCHER_PANTS: 'archer-pants',
            BOW: 'bow',
            PUFF: 'puff',
            STOLEN_BAG: 'stolen-bag',
            CROWN_CRUSHED: 'crown-crushed'
        };

        this.bgTextures = {};

        this.loadTextures();

        this.lastKeys = [];
        this.keys = [];
        this.KEY_UP = false;
        this.KEY_DOWN = false;
        this.KEY_LEFT = false;
        this.KEY_RIGHT = false;
        this.KEY_SPACE = false;
        this.KEY_SHIFT = false;
        this.KEY_ENTER_PRESSED = false;

        window.addEventListener('keyup', (e) => {
            delete this.keys[e.code.replace('Key', '')];
        });

        window.addEventListener('keydown', (e) => {
            this.keys[e.code.replace('Key', '')] = true;
        });

        this.loop();

        this.setScene('SCENE_MAIN_MENU');

        console.log('STARTUP COMPLETE');
    }

    loadTextures() {
        console.log('LOADING TEXTURES');
        for (let [key, val] of Object.entries(this.textures)) {
            let img = new Image();
            img.id = key;
            img.src = 'images/' + val + '.webp';
            this.textures[key] = img;

            img.onload = () => {
                let offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = img.width;
                offscreenCanvas.height = img.height;
                let offscreenCtx = offscreenCanvas.getContext('2d');
                offscreenCtx.drawImage(this.textures[key], 0, 0);
                document.body.appendChild(offscreenCanvas);
                console.log('OFFSCREEN CANVAS: ', offscreenCanvas);

                // get raw pixel values
                var imageData = offscreenCtx.getImageData(0, 0, img.width, img.height);
                var pixels = imageData.data;
                // modify each pixel
                for (var i = 0; i < pixels.length; i += 4) {
                    // red is pixels[i];
                    // green is pixels[i + 1];
                    // blue is pixels[i + 2];
                    // alpha is pixels[i + 3];
                    // all values are integers between 0 and 255
                    // do with them whatever you like. Here we are reducing the color volume to 75%
                    // without affecting the alpha channel
                    pixels[i] = pixels[i] * 0.5;
                    pixels[i + 1] = pixels[i + 1] * 0.5;
                    pixels[i + 2] = pixels[i + 2] * 0.5;
                }
                // write modified pixels back to canvas
                offscreenCtx.putImageData(imageData, 0, 0);
                offscreenCanvas.id = key;
                this.bgTextures[key] = offscreenCanvas;
                offscreenCanvas.style.display = 'none';

                document.querySelector('#canvases').appendChild(offscreenCanvas);
            };
        }
        console.log('LOADED TEXTURES: ', this.textures);
    }

    setScene(sceneKey, data = {}) {
        this.currentScene.length = 0;
        let currentScene = new this.scenes[sceneKey](this, data);
        this.currentScene.push(currentScene);
    }

    fillText(text, posX, posY, config = {}) {
        config.fontSize = '20px';
        config.borderColor = '#000000';
        config.color = '#ffffff';
        config.style = 'bold';

        let offset = { x: 0, y: 0 };

        if (config.align == 'center') {
            let metrics = this.ctx.measureText(text);
            offset.x = -metrics.width / 2;
        }

        let borderRadius = 2;
        for (let x = -1 * borderRadius; x < 2 * borderRadius; x++) {
            for (let y = -1 * borderRadius; y < 2 * borderRadius; y++) {
                if (x != 0 && y != 0) {
                    this.ctx.fillStyle = config.borderColor;
                    this.ctx.font = config.style + ' ' + config.fontSize + ' sans-serif';
                    this.ctx.fillText(text, (posX + x) + offset.x, (posY + y) + offset.y);
                }
            }
        }

        this.ctx.fillStyle = config.color;
        this.ctx.fillText(text, posX + offset.x, posY + offset.y);
    }

    update() {
        for (const [key, val] of Object.entries(this.keys)) {
            this.lastKeys[key] = this.keys[key];
        }

        this.KEY_UP = this.keys['W'] ? true : false;
        this.KEY_DOWN = this.keys['S'] ? true : false;
        this.KEY_LEFT = this.keys['A'] ? true : false;
        this.KEY_RIGHT = this.keys['D'] ? true : false;
        console.log(this.keys['Enter'], this.lastKeys['Enter']);
        this.KEY_ENTER_PRESSED = this.keys['Enter'] === true && this.lastKeys['Enter'] === true;

        this.KEY_SPACE = this.keys['Space'];

        this.KEY_SHIFT = (this.keys.ShiftLeft !== undefined && this.keys['ShiftLeft']) || (this.keys.ShiftRight !== undefined && this.keys['ShiftRight']);

        if (this.currentScene[0]) {
            this.currentScene[0].update();
        }

        this.lastKeys.length = 0;
    }

    render(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentScene[0]) {
            this.currentScene[0].render(ctx);
        }
    }

    loop() {
        this.update();
        this.render(this.ctx);

        this.frame++;

        window.requestAnimationFrame(this.loop.bind(this));
    }
}
