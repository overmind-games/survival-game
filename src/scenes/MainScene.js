import Phaser from "phaser";
import Player from "../sprites/Player";
import Resource from "../sprites/Resource";
import tilesetUrl from '../assets/map/tileset.png';
import Map from "../map/Map";
import FullscreenToggle from "../ui/FullscreenToggle";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super("MainScene")
    }

    preload() {
        Player.load(this)
        Resource.load(this)
        FullscreenToggle.load(this)
        this.load.image('tiles', tilesetUrl)
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

        new FullscreenToggle(this);

        this.matter.world.drawDebug = false;
        this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2);
    }

    update(time, delta) {
        this.player.update()

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