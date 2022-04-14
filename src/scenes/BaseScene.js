import Phaser from "phaser";
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import FullscreenToggle from "../ui/FullscreenToggle";

export default class BaseScene extends Phaser.Scene {

    /**
     * Only necessary if you want your code editor to know type information!
     * @type {PhaserMatterCollisionPlugin}
     */
    matterCollision;

    constructor(name) {
        super(name);
    }

    preload() {
        FullscreenToggle.load(this);
    }

    create() {
        new FullscreenToggle(this);

        this.matter.world.drawDebug = false;
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2)
            .on('down', this.onPressDebugKey, this);
    }

    onPressDebugKey() {
        if (this.matter.world.drawDebug) {
            this.matter.world.drawDebug = false;
            this.matter.world.debugGraphic.clear();
        }
        else {
            this.matter.world.drawDebug = true;
        }
    }

    update(time, delta) {}
}