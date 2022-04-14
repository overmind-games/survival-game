import Player from "../sprites/Player";
import Resource from "../sprites/Resource";
import Map from "../map/Map";
import BaseScene from "./BaseScene";
import Phaser from "phaser";

export default class MainScene extends BaseScene {

    constructor() {
        super("MainScene")
    }

    preload() {
        super.preload();
        Map.load(this);
        Player.load(this);
        Resource.load(this);
    }

    create() {
        super.create();

        this.map = this.initialiseMap();

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.storeEntering,
            callback: () => this.goingToStore()
        });

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });
    }

    initialiseMap() {
        const map = new Map(this);

        this.resources = map.resources.map(resourceObject => new Resource(this, resourceObject));

        this.player = new Player({
            scene: this,
            x: map.spawn.x,
            y: map.spawn.y
        })

        this.storeEntering = this.matter.add.rectangle(
            map.store.x + map.store.width / 2,
            map.store.y + map.store.height / 2,
            map.store.width,
            map.store.height,
            {
                isSensor: true
            }
        )

        return  map;
    }

    goingToStore() {
        this.matterCollision.removeOnCollideStart({
            objectA: this.player,
            objectB: this.storeEntering
        });

        this.matterCollision.addOnCollideEnd({
            objectA: this.player,
            objectB: this.storeEntering,
            callback: () => this.leavingShop()
        });

        this.player.showBalloon();
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on('down', this.enterStore, this);
    }

    enterStore() {
        this.cameras.main.fadeOut(700, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start("StoreScene");
            });
        })
    }

    leavingShop() {
        this.matterCollision.removeOnCollideEnd({
            objectA: this.player,
            objectB: this.storeEntering
        });

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.storeEntering,
            callback: () => this.goingToStore()
        });

        this.player.hideBalloon();
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        super.update();

        this.player.update()
    }
}