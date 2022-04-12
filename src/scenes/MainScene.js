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

        this.resources = map.resources.map(resourceObject => new Resource(this, resourceObject));

        this.player = new Player({
            scene: this,
            x: map.spawn.x,
            y: map.spawn.y
        })

        this.storeEntering = this.add.zone(map.store.x, map.store.y, map.store.width, map.store.height)

        this.matterCollision.addOnCollideActive({
            objectA: this.player,
            objectB: this.storeEntering,
            callback: () => console.log('start')
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

        window.scene = this;

        this.matter.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2);
    }

    update(time, delta) {
        this.player.update()

        // this.children.sort('y', (first, second) => { //TODO remove
        //     return first.y > second.y;
        // })

        // if (this.matter.overlap(this.player, this.storeEntering)) {
        //     console.log('Enter');
        // }

        if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
            if (this.matter.world.drawDebug) {
                this.matter.world.drawDebug = false;
                this.matter.world.debugGraphic.clear();
            }
            else {
                this.matter.world.drawDebug = true;
            }
        }
    }
}