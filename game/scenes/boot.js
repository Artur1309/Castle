import Phaser from 'phaser'

class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'BootScene', active: true});
    }
    preload() {
        this.load.spritesheet('player', '/resources/images/character.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('player-attack', '/resources/images/character_attack.png', { frameWidth: 42, frameHeight: 32 });
        this.load.spritesheet('bridges', '/resources/images/bridges.png', {frameWidth: 32, frameHeight: 16});
        this.load.spritesheet('monstrs', '/resources/images/monstrs.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keys', '/resources/images/keys.png', {frameWidth: 16, frameHeight: 32});
        this.load.spritesheet('doors', '/resources/images/doors.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('spikes', '/resources/images/spikes.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('scuba', '/resources/images/scuba.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('arrow', '/resources/images/arrow.png', {frameWidth: 16, frameHeight: 10});
        this.load.spritesheet('platform', '/resources/images/platform.png', {frameWidth: 32, frameHeight: 16});

        this.load.image('map', '/resources/images/map.png');
        this.load.tilemapTiledJSON('map', '/resources/map.json');

        this.load.audio('main-audio', ['/resources/audio/castle.mp3']);
        this.load.audio('die-player-audio', ['/resources/audio/die_player.mp3']);
        this.load.audio('die-monstr-audio', ['/resources/audio/die_monstr.mp3']);
        this.load.audio('collect-audio', ['/resources/audio/collect.mp3']);
        this.load.audio('open-door-audio', ['/resources/audio/open_door.mp3']);
        this.load.audio('jump-audio', ['/resources/audio/jump.mp3']);
        this.load.audio('scuba-audio', ['/resources/audio/scuba.mp3']);
    }
    create() {
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
}

export default BootScene;