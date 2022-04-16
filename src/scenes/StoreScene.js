import BaseScene from "./BaseScene";
import Map from "../map/Map";
import storeMapJson from "../assets/map/store.json";
import ceilingTilesetUrl from "../assets/tiles/ceiling.png";
import furnitureTilesetUrl from "../assets/tiles/furniture.png";
import Player from "../sprites/Player";
import Phaser from "phaser";

export default class StoreScene extends BaseScene {

    constructor() {
        super("StoreScene");
    }

    preload() {
        super.preload();
        this.load.image('ceilingTiles', ceilingTilesetUrl);
        this.load.image('furnitureTiles', furnitureTilesetUrl);
    }

    create() {
        super.create();

        const layers = [
            {
                id: 'ground-1',
                depth: -10,
                collides: true
            },
            {
                id: 'ground-2',
                depth: -9,
                collides: true
            },
            {
                id: 'below',
                depth: -5,
                collides: true
            },
            {
                id: 'above',
                depth: 20000,
                collides: false
            }
        ];

        this.map = new Map({
            scene: this,
            name: 'store',
            layers,
            json: storeMapJson,
            tileSets: [
                {
                    name: 'ceiling',
                    tileset: 'ceilingTiles'
                },
                {
                    name: 'furniture',
                    tileset: 'furnitureTiles'
                }
            ]
        });

        const spawn = this.map.getRegion('spawn');
        this.player = new Player({
            scene: this,
            x: spawn.x + spawn.width / 2,
            y: spawn.y + spawn.height / 2
        })

        this.player.setScale(1.5);
        this.player.setFixedRotation();

        this.cameras.main.centerOn(this.map.layer.widthInPixels / 2, this.map.layer.heightInPixels / 2);
        this.cameras.main.fadeIn(700, 0, 0, 0);

        const exitRegion = this.map.getRegion('exit');
        this.exit = this.matter.add.rectangle(
            exitRegion.x + exitRegion.width / 2,
            exitRegion.y + exitRegion.height / 2,
            exitRegion.width,
            exitRegion.height,
            {
                isSensor: true
            }
        );

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.exit,
            callback: () => this.goingToExit()
        });
    }

    goingToExit() {
        this.matterCollision.removeOnCollideStart({
            objectA: this.player,
            objectB: this.exit
        });

        this.matterCollision.addOnCollideEnd({
            objectA: this.player,
            objectB: this.exit,
            callback: () => this.leaveExit()
        });

        this.player.showBalloon();
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on('down', this.exitStore, this);
    }

    exitStore() {
        this.cameras.main.fadeOut(700, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start("MainScene", {
                    spawnName: 'storeExit'
                });
            });
        })
    }

    leaveExit() {
        this.matterCollision.removeOnCollideEnd({
            objectA: this.player,
            objectB: this.exit
        });

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.exit,
            callback: () => this.goingToExit()
        });

        this.player.hideBalloon();
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        super.update(time, delta);

        this.player.update();
    }
}