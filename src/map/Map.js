import mapJson from '../assets/map/map.json';
import ResourceObject from "./ResourceObject";

export default class Map extends Phaser.Tilemaps.Tilemap {

    constructor(scene) {
        const mapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled("tilemap", mapJson, true);
        super(scene, mapData)

        this.tileset = this.addTilesetImage('tileset', 'tiles', 32, 32, 0, 0);

        this.belowLayer = this.createLayer('below', this.tileset, 0, 0)
            .setCollisionByProperty({collides: true})
            .setDepth(-10);
        this.belowAdditionsLayer = this.createLayer('below-additions', this.tileset, 0, 0)
            .setDepth(-9);
        this.worldLayer = this.createLayer('world', this.tileset, 0, 0)
            .setCollisionByProperty({collides: true})
            .setDepth(-5);
        this.aboveLayer = this.createLayer('above', this.tileset, 0, 0)
            .setDepth(20000);

        scene.matter.world.convertTilemapLayer(this.belowLayer);
        scene.matter.world.convertTilemapLayer(this.worldLayer);

        window.layers = this.layers;
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