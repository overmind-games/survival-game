import Player from "../sprites/Player";
import Resource from "../sprites/Resource";
import Map from "../map/Map";
import BaseScene from "./BaseScene";
import tilesetUrl from "../assets/map/tileset.png";
import mapJson from '../assets/map/map.json';
import ResourceObject from "../map/ResourceObject";
import EnterRegion from "../behavior/EnterRegion";

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

        new EnterRegion(this, this.map, this.player, 'store','StoreScene', 'spawn');
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

    update(time, delta) {
        super.update();

        this.player.update()
    }
}