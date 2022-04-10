import Phaser from "phaser";
import Player from "../sprites/Player";
import Resource from "../sprites/Resource";
import tilesetUrl from '../assets/map/tileset.png';
import fullscreenUrl from '../assets/ui/fullscreen.png';
import Map from "../map/Map";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super("MainScene")
    }

    preload() {
        Player.load(this)
        Resource.load(this)
        this.load.image('tiles', tilesetUrl)
        this.load.spritesheet('fullscreen', fullscreenUrl, { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        const map = new Map(this);

        map.resources.forEach(resourceObject => new Resource(this, resourceObject));

        this.player = new Player({
            scene: this,
            x: map.spawn.x,
            y: map.spawn.y
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