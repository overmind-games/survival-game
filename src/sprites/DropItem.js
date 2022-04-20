import Phaser from "phaser";
import itemsUrl from '../assets/items.png'

const textures = {
    'log': 272,
    'stone': 273,
    'berry': 228
}

export default class DropItem extends Phaser.Physics.Matter.Sprite {

    static load(scene) {
        scene.load.spritesheet('items', itemsUrl,{
            frameWidth:32,
            frameHeight:32
        });
    }

    constructor(scene, type, x, y) {
        super(scene.matter.world, x, y, 'items', textures[type]);
        this.scene.add.existing(this);
        this.setStatic(true);
        this.setScale(0.5);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        const circleCollider = Bodies.circle(this.x,this.y,5,{
            isSensor:false,
            label:'collider'
        });

        this.setExistingBody(circleCollider);
        this.setMass(50);
    }
}