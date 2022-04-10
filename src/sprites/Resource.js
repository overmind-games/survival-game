import Phaser from "phaser";
import bushUrl from '../assets/map/resources/bush.png'
import stoneUrl from '../assets/map/resources/stone.png'
import treeUrl from '../assets/map/resources/tree.png'

export default class Resource extends Phaser.Physics.Matter.Sprite {

    static load(scene) {
        scene.load.image('bush', bushUrl)
        scene.load.image('stone', stoneUrl)
        scene.load.image('tree', treeUrl)
    }

    constructor(scene, {type, x, y, width, height, properties}) {
        const xOrigin = properties?.xOrigin ?? 0.5;
        const yOrigin = properties?.yOrigin ?? 0.5;

        super(scene.matter.world,
            x + width * xOrigin,
            y - height * (1 - yOrigin), type);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        const collider = Bodies.circle(this.x, this.y, 12, {
            isSensor: false,
            label: 'collider'
        });

        this.setExistingBody(collider);
        this.setOrigin(xOrigin, yOrigin)
        this.setStatic(true);

        this.scene.add.existing(this);
    }

    update(args) {

    }
}