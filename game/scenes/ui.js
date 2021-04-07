import Phaser from 'phaser'

class UIScene extends Phaser.Scene {
    constructor() {
        super({key: 'UIScene', active: false});
    }
    preload() {

    }
    create() {
        this.ui = {
            keys: {
                0:0,
                1:0,
                2:0,
                3:0,
                4:0,
                5:0,
            },
            scuba:0,
        }
        //this.graphics.fillRect(0, 0, 200, 60);
        let { width, height } = this.sys.game.canvas;
        this.add.graphics().fillStyle(0x000000).fillRect(0, 0, width, 50);
        for(let k in this.ui.keys){
            this.add.image(k*24 + 16, 20, 'keys', k).setScale(0.75);
            this.ui.keys[k] = this.add.text(k*24 + 13, 32, '0', { font: '14px Arial', fill: '#ffffff' });
        }
        this.ui.scuba = this.add.image(168 + 16, 20, 'scuba', 0).setScale(0.75);
        this.ui.scuba.visible = false;

        let GameScene = this.scene.get('GameScene');
        //  Listen for events from it
        GameScene.events.on('changeKey', function (n, v) {
            this.ui.keys[n].setText(v);
        }, this);
        GameScene.events.on('onScuba', function () {
            this.ui.scuba.visible = true;
        }, this);
        GameScene.events.on('offScuba', function () {
            this.ui.scuba.visible = false;
        }, this);
    }
}

export default UIScene;