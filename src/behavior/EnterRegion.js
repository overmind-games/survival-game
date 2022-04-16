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
            objectA: this.player,
            objectB: this.exit,
            callback: () => this.comeToExit()
        });
    }

    comeToExit() {
        this.scene.matterCollision.removeOnCollideStart({
            objectA: this.player,
            objectB: this.exit
        });

        this.scene.matterCollision.addOnCollideEnd({
            objectA: this.player,
            objectB: this.exit,
            callback: () => this.leaveExit()
        });

        this.player.showBalloon();
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on('down', this.exitStore, this);
    }

    exitStore() {
        this.scene.cameras.main.fadeOut(700, 0, 0, 0)
        this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.time.delayedCall(1000, () => {
                this.scene.scene.start(this.targetScene, {
                    spawnName: this.targetSpawn
                });
            });
        })
    }

    leaveExit() {
        this.scene.matterCollision.removeOnCollideEnd({
            objectA: this.player,
            objectB: this.exit
        });

        this.scene.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: this.exit,
            callback: () => this.comeToExit()
        });

        this.player.hideBalloon();
        this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
}