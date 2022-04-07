import Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import MainScene from "./MainScene";

const config = {
    width: 510,
    height: 510,
    backgroundColor: '#333333',
    type: Phaser.AUTO,
    parent: 'survival-game',
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 512,
        height: 512,
        zoom: 2
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: "matterCollision",
                mapping: "matterCollision"
            }
        ]
    }
}

const game = new Phaser.Game(config);