import Player from "../sprites/Player";
import Resource from "../sprites/Resource";
import Map from "../map/Map";
import BaseScene from "./BaseScene";
import tilesetUrl from "../assets/map/tileset.png";
import mapJson from '../assets/map/map.json';
import ResourceObject from "../map/ResourceObject";
import EnterRegion from "../behavior/EnterRegion";
import Phaser from "phaser";
import _ from "underscore";
import DropItem from "../sprites/DropItem";

export default class MainScene extends BaseScene {

    constructor() {
        super("MainScene")
    }

    preload() {
        super.preload();
        this.load.image('tiles', tilesetUrl);
        Player.load(this);
        Resource.load(this);
        DropItem.load(this);
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

        new EnterRegion(this, this.map, this.player, 'store', 'StoreScene', 'spawn');

        this.touching = this.add.group();

        this.matterCollision.addOnCollideStart({
            objectA: this.player.sensor,
            objectB: this.resources,
            callback: event => this.touching.add(event.gameObjectB)
        });

        this.matterCollision.addOnCollideEnd({
            objectA: this.player.sensor,
            objectB: this.resources,
            callback: event => this.touching.remove(event.gameObjectB)
        });

        this.actionKey =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) //TODO Create action trait
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

        return map;
    }

    onAction() {
        if (this.touching.countActive(true) === 0) {
            return;
        }

        const closest = _.min(this.touching.getChildren(), resource => Phaser.Math.Distance.BetweenPoints(this.player, resource));
        closest.hit();
    }

    addDrops(type, count, x, y) {
        const drops = Array.from({length:count}, i => new DropItem(this, type, x, y));

        this.matterCollision.addOnCollideStart({
            objectA: this.player.collider,
            objectB: drops,
            callback: event => {
                event.gameObjectB.destroy()
            }
        })
    }

    update(time, delta) {
        super.update();

        this.player.update();

        if (this.input.keyboard.checkDown(this.actionKey, 250)) {
            this.onAction();
        }
    }
}