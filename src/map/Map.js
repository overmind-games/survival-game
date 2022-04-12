import mapJson from '../assets/map/map.json';
import ResourceObject from "./ResourceObject";

export default class Map extends Phaser.Tilemaps.Tilemap {

    constructor(scene) {
        const mapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled("tilemap", mapJson, true);
        super(scene, mapData)

        this.tileset = this.addTilesetImage('tileset', 'tiles', 32, 32, 0, 0); //TODO try convert to getters

        this.ground = this.createLayer('ground', this.tileset, 0, 0)
            .setCollisionByProperty({collides: true});
        this.dirt = this.createLayer('dirt', this.tileset, 0, 0);
        this.buildings = this.createLayer('buildings', this.tileset, 0, 0)
            .setCollisionByProperty({collides: true});

        scene.matter.world.convertTilemapLayer(this.ground);
        scene.matter.world.convertTilemapLayer(this.buildings);
    }

    get spawn() {
        return this.findObject('regions', object => object.name === 'spawn');
    }

    get store() {
        return this.findObject("regions", obj => obj.name === "store");
    }

    get resources() {
        return this.getObjectLayer('resources').objects
            .map(object => new ResourceObject(object));
    }
}