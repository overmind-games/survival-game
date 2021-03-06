import Phaser from "phaser";
import mageUrl from '../assets/mage.png';
import mageAtlas from '../assets/mage_atlas.json';
import mageAnim from '../assets/mage_anim.json';
import itemsUrl from '../assets/items.png';
import balloonsUrl from '../assets/sprites/balloons.png';

export default class Player extends Phaser.Physics.Matter.Sprite {

    static load(scene) {
        scene.load.atlas('mage', mageUrl, mageAtlas);
        scene.load.animation('mage_anim', mageAnim);
        scene.load.spritesheet('items', itemsUrl, {
            frameWidth: 32,
            frameHeight: 32,
        });
        scene.load.spritesheet('balloons', balloonsUrl, {
            frameWidth: 32,
            frameHeight: 32,
        })
    }

    constructor({scene, x, y}) {
        super(scene.matter.world, x, y, 'mage', 'mage_idle_1');

        this.speed = 1.5;
        this.scene.add.existing(this);

        const {Body, Bodies} = Phaser.Physics.Matter.Matter;

        this.collider = Bodies.circle(this.x, this.y, 12, {
            isSensor: false,
            label: 'playerCollider'
        });

        this.sensor = Bodies.circle(this.x, this.y, 24, {
            isSensor: true,
            label: 'playerSensor'
        });

        const body = Body.create({
            parts: [this.collider, this.sensor],
            friction: 0.35
        });

        this.setExistingBody(body);
        this.setFixedRotation();

        this.tool = scene.add.sprite(100, 100, 'items', 161)
            .setScale(0.7)
            .setOrigin(0.25, 0.75);

        this.balloon = scene.add.sprite(200, 200, 'balloons', 30)
            .setDepth(50000)
            .setVisible(false);

        this.inputKeys = scene.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });
    }

    update(args) {
        let velocity = new Phaser.Math.Vector2();

        if (this.inputKeys.left.isDown) {
            velocity.x -= 1;
        }

        if (this.inputKeys.right.isDown) {
            velocity.x += 1;
        }

        if (this.inputKeys.up.isDown) {
            velocity.y -= 1;
        }

        if (this.inputKeys.down.isDown) {
            velocity.y += 1;
        }

        velocity.setLength(this.speed);
        this.setVelocity(velocity.x, velocity.y);
        this.setDepth(this.y);

        if (this.body.speed > 0) {
            this.anims.play('mage_walk', true);
        } else {
            this.anims.play('mage_idle', true);
        }

        this.tool.setPosition(this.x, this.y);
        this.tool.setDepth(this.y);

        this.balloon.setPosition(this.x, this.y - 32)
    }

    showBalloon() {
        this.balloon.setVisible(true)
    }

    hideBalloon() {
        this.balloon.setVisible(false)
    }
}