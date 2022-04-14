import fullscreenUrl from "../assets/ui/fullscreen.png";

export default class FullscreenToggle extends Phaser.GameObjects.Image {

    static load(scene) {
        scene.load.spritesheet('fullscreen', fullscreenUrl, { frameWidth: 64, frameHeight: 64 });
    }

    constructor(scene) {
        super(scene, 512 - 16, 16, 'fullscreen', 0);

        this.setOrigin(1, 0)
        this.setScale(0.5, 0.5)
        this.setInteractive()

        const FKey = scene.input.keyboard.addKey('F');

        this.on('pointerup', this.toggleFullScreen, this);
        FKey.on('down', this.toggleFullScreen, this);
    }

    toggleFullScreen() {
        if (this.scene.scale.isFullscreen) {
            this.setFrame(0);
            this.scene.scale.stopFullscreen();
        } else {
            this.setFrame(1);
            this.scene.scale.startFullscreen();
        }
    }
}