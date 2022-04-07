import Phaser from "phaser";
import Player from "./Player";
import tilesetUrl from './assets/tileset.png';
import fullscreenUrl from './assets/ui/fullscreen.png';
import map from './assets/map.json';

export default class MainScene extends Phaser.Scene {

    constructor() {
        super("MainScene")
    }

    preload() {
        Player.load(this)
        this.load.image('tiles', tilesetUrl)
        this.load.tilemapTiledJSON('map', map)
        this.load.spritesheet('fullscreen', fullscreenUrl, { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        const tilemap = this.make.tilemap({key: 'map'})
        const tileset = tilemap.addTilesetImage('tileset', 'tiles', 32, 32, 0, 0);
        const ground = tilemap.createLayer('ground', tileset, 0, 0);
        const dirt = tilemap.createLayer('dirt', tileset, 0, 0);

        ground.setCollisionByProperty({collides: true})
        this.matter.world.convertTilemapLayer(ground)

        this.player = new Player({
            scene: this,
            x: 100,
            y: 100
        })
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        })

        const button = this.add.image(512 - 16, 16, 'fullscreen', 0).setOrigin(1, 0).setScale(0.5, 0.5).setInteractive()
        button.on('pointerup', function () {
            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
        }, this);

        const FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function () {
            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
        }, this);
    }

    update(time, delta) {
        this.player.update()
    }
}