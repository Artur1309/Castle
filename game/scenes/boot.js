import Phaser from 'phaser'

class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'BootScene', active: true});
    }
    preload() {
        this.load.spritesheet('player', __dirname + 'resources/images/character.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('player-attack', __dirname + 'resources/images/character_attack.png', { frameWidth: 42, frameHeight: 32 });
        this.load.spritesheet('bridges', __dirname + 'resources/images/bridges.png', {frameWidth: 32, frameHeight: 16});
        this.load.spritesheet('monstrs', __dirname + 'resources/images/monstrs.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keys', __dirname + 'resources/images/keys.png', {frameWidth: 16, frameHeight: 32});
        this.load.spritesheet('doors', __dirname + 'resources/images/doors.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('spikes', __dirname + 'resources/images/spikes.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('scuba', __dirname + 'resources/images/scuba.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('arrow', __dirname + 'resources/images/arrow.png', {frameWidth: 16, frameHeight: 10});
        this.load.spritesheet('platform', __dirname + 'resources/images/platform.png', {frameWidth: 32, frameHeight: 16});

        this.load.image('map', __dirname + 'resources/images/map.png');
        this.load.tilemapTiledJSON('map', __dirname + 'resources/map.json');

        this.load.audio('main-audio', [__dirname + 'resources/audio/castle.mp3']);
        this.load.audio('die-player-audio', [__dirname + 'resources/audio/die_player.mp3']);
        this.load.audio('die-monstr-audio', [__dirname + 'resources/audio/die_monstr.mp3']);
        this.load.audio('collect-audio', [__dirname + 'resources/audio/collect.mp3']);
        this.load.audio('open-door-audio', [__dirname + 'resources/audio/open_door.mp3']);
        this.load.audio('jump-audio', [__dirname + 'resources/audio/jump.mp3']);
        this.load.audio('scuba-audio', [__dirname + 'resources/audio/scuba.mp3']);
    }
    create() {
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
}

export default BootScene;