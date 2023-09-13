class SceneMain extends Scene {
    constructor(game) {
        super({ key: 'SceneMain' });

        this.game = game;
        this.canvas = this.game.canvas;
        this.ctx = this.game.ctx;
        this.textures = this.game.textures;
        this.bgTextures = this.game.bgTextures;

        this.mapWidth = Math.floor(this.canvas.width / 16);
        this.mapHeight = Math.floor(this.canvas.height / 16);
        this.bgTilemap = array2d(this.mapWidth, this.mapHeight, null);
        this.tilemap = array2d(this.mapWidth, this.mapHeight, null);

        this.moveCooldownDelay = 10;
        this.moveCooldown = 0;

        this.fallFaster = false;

        this.placeTileAsBg = false;
        this.hasPlacedCrown = false;
        this.tilesLeftUntilJewels = 3;

        //this.timeUntilNextWaveDelay = 60 * (10 * 1);
        this.timeUntilNextWaveDelay = 60 * (60);
        this.timeUntilNextWaveTick = this.timeUntilNextWaveDelay;

        this.eventIdKey = 0;
        this.events = [];
        this.tiles = [];
        this.entities = [];

        this.moveEventId = null;
        this.placingTiles = [];


        this.tutorialStep = -1;
        this.isPaused = false;


        this.generateTerrain();


        this.callUpNewTileToPlace();


        // Tile updates
        let updateTileTick = 0;
        this.addEvent(function() {
            if (this.isPaused) {
                return;
            }

            for (let i = 0; i < this.tiles.length; i++) {
                let tile = this.tiles[i];

                tile.velocity.y = 1;

                let updateTileDelay = 2;

                if (tile.isPlacing && this.fallFaster) {
                    updateTileDelay = 1;
                }

                let tilemapsToCollideWith = [];
                if (tile.isBg) {
                    tilemapsToCollideWith.push(this.tilemap);
                    tilemapsToCollideWith.push(this.bgTilemap);
                }
                else {
                    tilemapsToCollideWith.push(this.tilemap);
                }

                if (updateTileTick % updateTileDelay == 0) {
                    for (let t = 0; t < tilemapsToCollideWith.length; t++) {
                        let tilemap = tilemapsToCollideWith[t];

                        if (tilemap[tile.x][tile.y + tile.velocity.y] === null &&
                            tile.y + tile.velocity.y < this.mapHeight) {
                            tile.isFalling = true;
                        }
                        else {
                            tile.isFalling = false;
                        }

                        if (!tile.isFalling) {
                            if (!tile.isLiving) {
                                tile.velocity.x = 0;
                            }
                            tile.velocity.y = 0;

                            if (tile.isPlacing && !tile.isPlaced) {

                                if (this.placeMoreTiles && this.hasPlacedCrown) {
                                    for (let x = -1; x < 2; x++) {
                                        for (let y = -1; y < 2; y++) {
                                            if (tile.x + x >= 0 &&
                                                tile.x + x < this.mapWidth &&
                                                tile.y + y >= 0 &&
                                                tile.y + y < this.mapHeight) {

                                                let extraTile = new tile.constructor(tile.x + x, tile.y + y);
                                                this.addTile(extraTile);
                                                extraTile.isBg = this.placeTileAsBg;
                                                extraTile.moveTo(extraTile.x, extraTile.y);
                                            }
                                        }
                                    }
                                }

                                tile.isPlacing = false;
                                tile.isPlaced = true;

                                if ( ! this.hasPlacedCrown) {
                                    this.hasPlacedCrown = true;
                                }

                                this.placingTiles.length = 0;
                            }
                        }

                        if (tile.x + tile.velocity.x < 0) {
                            tile.velocity.x = 0;
                        }
                        else if (tile.x + tile.velocity.x > this.mapWidth - 1) {
                            tile.velocity.x = 0;
                        }

                        if (tile.velocity.x != 0 || tile.velocity.y != 0) {
                            if (tilemap[tile.x + tile.velocity.x][tile.y + tile.velocity.y] !== null) {
                                tile.velocity.x = 0;
                            }
                        }
                    }

                    tile.moveTo(
                        tile.x + tile.velocity.x,
                        tile.y + tile.velocity.y
                    );

                    let tileBelow = this.tilemap[tile.x][tile.y + 1];
                    if (tileBelow) {
                        if (tileBelow.isLiving) {
                            console.log('KNIGHT: ', tileBelow);
                            if (tileBelow.kill) {
                                tileBelow.kill();
                            }
                        }
                        else if (tile.isPlacing && tile.velocity.x == 0 && tile.velocity.y == 1) {
                            for (let i = 0; i < 5; i++) {
                                console.log((tile.x * 16) + 4, (tile.y * 16) + 16);
                                let particle = new Particle({
                                    texture: this.textures.PUFF,
                                    x: (tile.x * 16) + 4,
                                    y: (tile.y * 16) + 16,
                                    frameWidth: 8,
                                    frameHeight: 8,
                                    animDelay: 20,
                                    growRate: 0.1
                                });

                                particle.velocity = {
                                    x: randArb(-2, 2),
                                    y: randArb(-2, 2)
                                };

                                this.addEntity(particle);

                                console.log('SPAWNED PARTICLE: ', particle);
                            }

                            if (tileBelow.texture) {
                                if (tileBelow.texture.id == 'GRASS') {
                                    tileBelow.texture = this.textures['DIRT'];
                                }
                                else if(tileBelow.texture.id == 'CROWN') {
                                    this.startGameOver('crushed');
                                    delete this.tilemap[tileBelow.x][tileBelow.y];
                                    this.tilemap[tileBelow.x][tileBelow.y] = null;
                                }
                            }
                        }
                    }

                    let tileLeft = tile.x - 1 >= 0 ? this.tilemap[tile.x - 1][tile.y] : null;
                    if (tileLeft && tile.isLiving && !tileLeft.isLiving) {
                        if (tile.attackCooldownLeft == 0 && tileLeft.hit) {
                            console.log('TILE LEFT: ', tileLeft);
                            tileLeft.hit();
                            tile.attackCooldownLeft = tile.attackCooldownDelay;
                        }
                    }

                    let tileRight = tile.x + 1 < this.mapWidth - 1 ? this.tilemap[tile.x + 1][tile.y] : null;
                    if (tileRight && tile.isLiving && !tileRight.isLiving) {
                        console.log('COOLDOWN: ', tile.attackCooldownLeft, tile);
                        if (tile.attackCooldownLeft == 0 && tileRight.hit) {
                            console.log('TILE RIGHT: ', tileRight);
                            tileRight.hit();
                            tile.attackCooldownLeft = tile.attackCooldownDelay;
                        }
                    }
                }
            }
            updateTileTick++;
        }, 2, true);


        // Enemy hoard timer
        this.wave = 1;
        this.enemyWaveId = this.addEvent(function () {
            for (let i = 0; i < randInt(2, 4) * this.wave; i++) {
                let spawnLocations = [{ x: 0, y: this.mapHeight - 6 }, { x: this.mapWidth - 1, y: this.mapHeight - 6 }];
                let spawnLocation = spawnLocations[randInt(0, spawnLocations.length - 1)];

                let knight = new Knight(spawnLocation.x, spawnLocation.y);
                this.addTile(knight);

                let archer = new Archer(spawnLocation.x, spawnLocation.y);
                this.addTile(archer);
            }

            this.wave++;

            this.timeUntilNextWaveDelay -= this.wave * 5;
            this.timeUntilNextWaveTick = this.timeUntilNextWaveDelay;

            this.changeEventDelay(this.enemyWaveId, this.timeUntilNextWaveDelay);
        }, this.timeUntilNextWaveDelay, true);


        // Create clouds
        for (let i = 0; i < 10; i++) {
            let cloud = new Cloud(randInt(0, this.canvas.width), randInt(0, this.canvas.height * 0.75));
            this.addEntity(cloud);
        }

        // START TUTORIAL
        this.addEvent(this.startTutorial, 10, false);
    }

    addEvent(callback, delay, loop = false) {
        console.log('Added event');

        let eventId = this.eventIdKey;

        this.events.push({
            id: eventId,
            tick: 0,
            delay: delay,
            callback: callback,
            loop: loop
        });

        this.eventIdKey++;

        console.log('NEW EVENT ID: ', eventId);

        return eventId;
    }

    changeEventDelay(id, newDelay) {
        for (let i = 0; i < this.events.length; i++) {
            console.log('is ' + id + ' == ' + this.events[i].id);
            if (id == this.events[i].id) {
                this.events[i].delay = newDelay;
                console.log('Changed event ' + id + ' delay to ' + newDelay);
            }
        }
    }

    removeEvent(id) {
        for (let i = 0; i < this.events.length; i++) {
            if (id == this.events[i].id) {
                this.events.splice(i, 1);
                i--;
            }
        }
    }

    addTile(tile) {
        tile.scene = this;

        tile.basePostInit();
        if (tile.postInit) {
            tile.postInit();
        }
        this.tiles.push(tile);
    }

    addEntity(entity) {
        entity.scene = this;

        if (entity.postInit) {
            entity.postInit();
        }

        if (entity.baseAfterPostInit) {
            entity.baseAfterPostInit();
        }

        this.entities.push(entity);
    }

    generateTerrain() {
        console.log('GENERATING TERRAIN');
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = this.mapHeight - 5; y < this.mapHeight; y++) {
                if (y == this.mapHeight - 5) {
                    let grass = new GrassTile(x, y);

                    this.addTile(grass);
                }
                else {
                    let dirt = new DirtTile(x, y);

                    this.addTile(dirt);
                }
            }
        }
    }

    callUpNewTileToPlace() {
        console.log('Call up new tile');

        let tileX = Math.round(this.mapWidth / 2);

        let placingTile = null;
        if (!this.hasPlacedCrown) {
            placingTile = new CrownTile(
                tileX,
                3
            );
            placingTile.texture = this.textures.CROWN;
            this.crown = placingTile;
        }
        else { //if (this.tilesLeftUntilJewels > 0) {
            placingTile = new BrickTile(
                tileX,
                3
            );
            this.tilesLeftUntilJewels--;
        }
        /*else {
            placingTile = new JewelTile(
                tileX,
                3
            );
            this.tilesLeftUntilJewels = 10;
        }*/
        placingTile.isFalling = false;
        placingTile.isPlacing = true;
        placingTile.isPlaced = false;

        /*
        this.moveEventId = this.addEvent(() => {

        }, 10, true);
        */

        this.addTile(placingTile);

        this.placingTiles.push(placingTile);

        if (this.tutorialStep == 3) {
            this.setTutorialStep(4);
        }
    }

    startTutorial() {
        this.setTutorialStep(0);
        this.isPaused = true;
    }

    setTutorialStep(step) {
        this.tutorialStep = step;

        switch (step) {
            case 0: {
                this.isPaused = true;
                this.addEvent(() => {
                    this.setTutorialStep(1);
                }, 150, false);
                break;
            }

            case 1: {
                this.isPaused = false;
                this.addEvent(() => {
                    this.setTutorialStep(2);
                }, 100, false);
                break;
            }

            case 2: {
                this.isPaused = true;
                this.addEvent(() => {
                    this.setTutorialStep(3);
                }, 150, false);
                break;
            }

            case 3: { // Once the first brick is called up, it will trigger step 4
                this.isPaused = false;
                break;
            }

            case 4: {
                this.isPaused = true;
                this.addEvent(() => {
                    this.setTutorialStep(5);
                }, 150, false);
                break;
            }

            case 5: {
                this.isPaused = false;
                this.addEvent(() => {
                    this.setTutorialStep(6);
                }, 50, false);
                break;
            }

            case 6: {
                break;
            }
        }
    }

    startGameOver(ending) {
        this.addEvent(() => {
            this.game.setScene('SCENE_GAME_OVER', {
                ending: ending
            });
        }, 100, false);
    }

    update() {
        for (let i = 0; i < this.events.length; i++) {
            let event = this.events[i];

            if (event.tick < event.delay) {
                event.tick++;
            }
            else {
                (event.callback.bind(this))();
                if (event.loop) {
                    event.tick = 0;
                }
                else {
                    this.events.splice(i, 1);
                    i--;
                    console.log('REMOVED EVENT ' + event.id);
                }
            }
        }

        if ( ! this.isPaused) {
            this.mainUpdate();
        }
    }

    mainUpdate() {
        this.placeTileAsBg = this.game.KEY_SPACE ? true : false;
        this.placeMoreTiles = this.game.KEY_SHIFT ? true : false;
        this.fallFaster = this.game.KEY_DOWN ? true : false;

        if (this.placingTiles.length > 0) {
            for (let i = 0; i < this.placingTiles.length; i++) {
                let placingTile = this.placingTiles[i];

                if (this.game.KEY_LEFT) {
                    placingTile.velocity.x = -1;
                }
                else if (!this.game.KEY_RIGHT) {
                    placingTile.velocity.x = 0;
                }

                if (this.game.KEY_RIGHT) {
                    placingTile.velocity.x = 1;
                }
                else if (!this.game.KEY_LEFT) {
                    placingTile.velocity.x = 0;
                }

                if (this.placeTileAsBg) {
                    placingTile.isBg = true;
                    placingTile.moveTo(placingTile.x, placingTile.y);
                }
                else {
                    placingTile.isBg = false;
                    placingTile.moveTo(placingTile.x, placingTile.y);
                }

                if (placingTile.isPlaced) {
                    this.placingTiles.splice(i, 1);
                    i--;
                }
            }
        }
        else {

            console.log('COLLIDED!');
            this.callUpNewTileToPlace();
        }

        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];

            if (entity.baseUpdate) {
                entity.baseUpdate();
            }

            if (entity.width) {
                if (entity.x < -entity.width) {
                    entity.x = (this.mapWidth * 16) + 128;
                }
            }

            entity.update();

            if (entity.canDestroy) {
                this.entities.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            if (tile.update) {
                tile.update();
            }

            if (tile.isBg) {
                if (tile.texture) {
                    tile.texture = this.bgTextures[tile.texture.id];
                }
            }
            else {
                if (tile.texture) {
                    tile.texture = this.textures[tile.texture.id];
                }
            }

            if (tile.canDestroy) {
                this.tilemap[tile.x][tile.y] = null;
                this.tiles.splice(i, 1);
                i--;
            }
        }

        if (this.timeUntilNextWaveTick > 0) {
            this.timeUntilNextWaveTick--;
        }
    }

    drawImageRotated(image, x, y, width, height, angle) {
        const TO_RADIANS = Math.PI / 180; 

        // save the current co-ordinate system 
        // before we screw with it
        this.ctx.save(); 

        // move to the middle of where we want to draw our image
        this.ctx.translate(x, y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        this.ctx.rotate(angle * TO_RADIANS);

        // draw it up and to the left by half the width
        // and height of the image 
        this.ctx.drawImage(image, -(image.width/2), -(image.height/2), width, height);

        // and restore the co-ords to how they were when we began
        this.ctx.restore();
    }

    render(ctx) {
        console.log('RENDERING');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#64a5ff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].depth == -2) {
                this.entities[i].render(this.ctx);
            }
        }

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].depth == -1) {
                this.entities[i].render(this.ctx);
            }
        }


        for (let i = 0; i < this.placingTiles.length; i++) {
            let placingTile = this.placingTiles[i];

            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (this.placeMoreTiles && this.hasPlacedCrown) {
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.globalAlpha = 0.5;
                        this.ctx.fillRect((placingTile.x + x) * 16, (placingTile.y + y) * 16, 16, 16);
                        this.ctx.globalAlpha = 1;
                        this.ctx.fillRect(((placingTile.x + x) * 16) + 1, ((placingTile.y + y) * 16) + 1, 14, 14);
                    }

                    if (this.tutorialStep == 0 && (x == 0 || y == 0)) {
                        let angle = 0;
                        if (x == 0 && y == 1) {
                            angle = 90;
                        }
                        else if (x == -1 && y == 0) {
                            angle = 180;
                        }
                        else if (x == 0 && y == -1) {
                            angle = 270;
                        }
                        this.drawImageRotated(this.textures.ARROW_GUI, ((placingTile.x + x) * 16) + 8, ((placingTile.y + y) * 16) + 8, 16, 16, angle);
                    }
                }
            }

            if (this.tutorialStep == 0) {
                this.game.fillText('USE [A], [S], [D] TO MOVE FALLING TILES', (placingTile.x*16) + 8, (placingTile.y*16) - 24, {
                    align: 'center'
                });
            }
            else if (this.tutorialStep == 2) {
                this.game.fillText('PLACE THE CROWN WHERE IT CAN BE DEFENDED', this.canvas.width / 2, this.canvas.height / 4, {
                    align: 'center'
                });
            }
            else if (this.tutorialStep == 4) {
                this.game.fillText('USE BRICKS TO BUILD WALLS AROUND THE CROWN', this.canvas.width / 2, this.canvas.height / 4, {
                    align: 'center'
                });
            }
            else if (this.tutorialStep == 6) {
                this.game.fillText('HOLD [SHIFT] TO LAY EXTRA BRICKS', this.canvas.width / 2, this.canvas.height / 4, {
                    align: 'center'
                });
            }
            
        }



        let crownFound = false;


        // BG
        for (let x = 0; x < this.bgTilemap.length; x++) {
            for (let y = 0; y < this.bgTilemap[x].length; y++) {
                let tile = this.bgTilemap[x][y];

                if ( ! tile || ! tile.isBg) {
                    continue;
                }

                if (tile.texture && tile.texture.id == 'CROWN') {
                    crownFound = true;
                }

                tile.render(this.ctx);
            }
        }


        // FG
        console.log('SIZE: ', this.tilemap.length);
        for (let x = 0; x < this.tilemap.length; x++) {
            for (let y = 0; y < this.tilemap[x].length; y++) {

                let tilemaps = [this.bgTilemap, this.tilemap ];
                for (let i = 0; i < tilemaps.length; i++) {
                    let tilemap = tilemaps[i];

                    let tile = tilemap[x][y];
                    
                    if ( ! tile || tile.isBg ) {
                        continue;
                    }

                    if (tile.texture && tile.texture.id == 'CROWN') {
                        crownFound = true;
                    }

                    if (tile.attackCooldownLeft !== undefined) {
                        if (tile.attackCooldownLeft > 0) {
                            tile.attackCooldownLeft--;
                        }
                    }

                    if (tile.isFalling) {
                        for (let i = 0; i < 5; i++) {
                            let oldPos = tile.positionHistory[tile.positionHistory.length - i];

                            this.ctx.globalAlpha = 1 / i;
                            tile.render(this.ctx, oldPos);
                            this.ctx.globalAlpha = 1;
                        }
                    }

                    if (this.crown && tile.direction !== undefined) {
                        if (tile.x > this.crown.x) {
                            tile.direction = -1;
                        }
                        else {
                            tile.direction = 1;
                        }

                        if (tile.velocity.y == 0) {
                            tile.velocity.x = tile.direction;
                        }
                    }

                    if ( ! tile.isBg) {
                        tile.render(this.ctx);
                    }

                    if (tile.renderAfterBaseRender) {
                        tile.renderAfterBaseRender(this.ctx);
                    }
                }
            }
        }

        if ( ! crownFound) {
            this.startGameOver('crushed');
        }

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].depth == 0) {
                this.entities[i].render(this.ctx);
            }
        }

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].depth == 1) {
                this.entities[i].render(this.ctx);
            }
        }

        this.ctx.fillStyle = '#000000';
        this.ctx.fillText('NEXT WAVE IN: ' + (this.timeUntilNextWaveTick / 60).toFixed(0) + ' SECONDS', 16, 16);
    }
}
