import Phaser from 'phaser'
import BootScene from './scenes/boot'
import GameScene from './scenes/game'
import UIScene from './scenes/ui'

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },

    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [BootScene, GameScene, UIScene]
};

let game = new Phaser.Game(config);