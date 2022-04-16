import Player from "../sprites/Player";
import Resource from "../sprites/Resource";
import Map from "../map/Map";
import BaseScene from "./BaseScene";
import Phaser from "phaser";
import tilesetUrl from "../assets/map/tileset.png";
import mapJson from '../assets/map/map.json';
import ResourceObject from "../map/ResourceObject";

export default class MainScene extends BaseScene {

    constructor() {
        super("MainScene")
    }

    preload() {
        super.preload();
        this.load.image('tiles', tilesetUrl);
        Player.load(this);
        Resource.load(this);
    }

    create({spawnName = 'spawn'}) {
        super.create();

        this.map = this.initialiseMap();

        const spawn = this.map.getRegion(spawnName);
        this.player = new Player({
            scene: this,
            x: spawn.x + spawn.width / 2,
            y: spawn.y + spawn.height / 2
        })

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.storeEntering,
            callback: () => this.goingToStore()
        });
    }

    initialiseMap() {
        const layers = [
            {
                id: 'below',
                depth: -10,
                collides: true
            },
            {
                id: 'below-additions',
                depth: -9,
                collides: false
            },
            {
                id: 'world',
                depth: -5,
                collides: true
            },
            {
                id: 'above',
                depth: 20000,
                collides: false
            }
        ];

        const map = new Map({
            scene: this,
            name: 'outdoor',
            layers,
            json: mapJson,
            tileSets: [
                {
                    name: 'tileset',
                    tileset: 'tiles'
                }
            ]
        });

        this.resources = map.getObjectLayer('resources').objects
            .map(object => new ResourceObject(object))
            .map(resourceObject => new Resource(this, resourceObject));

        const store = map.getRegion('store');
        this.storeEntering = this.matter.add.rectangle(
            store.x + store.width / 2,
            store.y + store.height / 2,
            store.width,
            store.height,
            {
                isSensor: true
            }
        )

        return map;
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