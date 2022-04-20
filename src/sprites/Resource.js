import Phaser from "phaser";
import bushUrl from '../assets/map/resources/bush.png'
import stoneUrl from '../assets/map/resources/stone.png'
import treeUrl from '../assets/map/resources/tree.png'
import bushSoundUrl from '../assets/audio/bush.mp3'
import stoneSoundUrl from '../assets/audio/stone.mp3'
import treeSoundUrl from '../assets/audio/tree.mp3'

export default class Resource extends Phaser.Physics.Matter.Sprite {

    static load(scene) {
        scene.load.image('bush', bushUrl);
        scene.load.image('stone', stoneUrl);
        scene.load.image('tree', treeUrl);
        scene.load.audio('bush-sound', bushSoundUrl);
        scene.load.audio('stone-sound', stoneSoundUrl);
        scene.load.audio('tree-sound', treeSoundUrl);
    }

    // /**
    //  * @type {MainScene}
    //  */
    // scene;

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
        this.setDepth(this.y)

        this.drops = JSON.parse(properties?.drops ?? "[]");
        this.type = type;
        this.hitSound = this.scene.sound.add(`${type}-sound`);
        this.health = 5;

        this.scene.add.existing(this);
    }

    hit() {
        this.hitSound.play();
        this.health--;

        if (this.health === 0) {
            this.drops.forEach(drop => this.scene.addDrops(drop.type, drop.count, this.x, this.y))

            this.destroy(true);
        }
    }

    update(args) {

    }
}