import BaseScene from "./BaseScene";
import Map from "../map/Map";
import storeMapJson from "../assets/map/store.json";
import ceilingTilesetUrl from "../assets/tiles/ceiling.png";
import furnitureTilesetUrl from "../assets/tiles/furniture.png";
import Player from "../sprites/Player";
import EnterRegion from "../behavior/EnterRegion";

export default class StoreScene extends BaseScene {

    constructor() {
        super("StoreScene");
    }

    preload() {
        super.preload();
        this.load.image('ceilingTiles', ceilingTilesetUrl);
        this.load.image('furnitureTiles', furnitureTilesetUrl);
    }

    create(params) {
        super.create(params);

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

        new EnterRegion(this, this.map, this.player, 'exit','MainScene', 'storeExit');
    }

    update(time, delta) {
        super.update(time, delta);

        this.player.update();
    }
}