import Phaser from "phaser";

export default class EnterRegion {

    constructor(scene, map, player, enterRegion, targetScene, targetSpawn) {
        this.player = player;
        this.scene = scene;
        this.targetScene = targetScene;
        this.targetSpawn = targetSpawn;

        const box = map.getRegion(enterRegion);

        this.exit = scene.matter.add.rectangle(
            box.x + box.width / 2,
            box.y + box.height / 2,
            box.width,
            box.height,
            {
                isSensor: true
            }
        );

        scene.matterCollision.addOnCollideStart({
            objectA: this.player.collider,
            objectB: this.exit,
            callback: () => this.comeToExit()
        });

        scene.matterCollision.addOnCollideEnd({
            objectA: this.player.collider,
            objectB: this.exit,
            callback: () => this.leaveExit()
        });

        this.key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    comeToExit() {
        this.player.showBalloon();
        this.key.once('down', this.onExit, this);
    }

    onExit() {
        this.scene.cameras.main.fadeOut(700, 0, 0, 0, )
        this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.time.delayedCall(1000, () => {
                this.scene.scene.switch(this.targetScene, {
                    spawnName: this.targetSpawn,
                });
                this.scene.cameras.main.fadeEffect.reset();
            });
        });
    }

    leaveExit() {
        this.player.hideBalloon();
        this.key.off('down', this.onExit, this);
    }
}