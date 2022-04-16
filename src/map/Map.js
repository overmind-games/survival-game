export default class Map extends Phaser.Tilemaps.Tilemap {

    constructor({scene, name, layers, json, tileSets}) {
        const mapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(`${name}-tilemap`, json, true);
        super(scene, mapData)

        this.tileSets = tileSets.map(({name, tileset}) =>
            this.addTilesetImage(name, tileset, 32, 32, 0, 0)
        );

        layers.forEach(layer => this.makeLayer(layer.id, layer.depth, layer.collides))
    }

    makeLayer(layerID, depth, collides = false) {
        const layer = this.createLayer(layerID, this.tileSets, 0, 0)
            .setCollisionByProperty({collides})
            .setDepth(depth);

        if (collides) this.scene.matter.world.convertTilemapLayer(layer);

        return layer;
    }

    getRegion(name) {
        return this.findObject('regions', object => object.name === name);
    }
}