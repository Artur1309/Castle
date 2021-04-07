import Phaser from 'phaser'

class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'BootScene', active: true});
    }
    preload() {
        this.load.spritesheet('player', '/Castle/resources/images/character.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('player-attack', '/Castle/resources/images/character_attack.png', { frameWidth: 42, frameHeight: 32 });
        this.load.spritesheet('bridges', '/Castle/resources/images/bridges.png', {frameWidth: 32, frameHeight: 16});
        this.load.spritesheet('monstrs', '/Castle/resources/images/monstrs.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keys', '/Castle/resources/images/keys.png', {frameWidth: 16, frameHeight: 32});
        this.load.spritesheet('doors', '/Castle/resources/images/doors.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('spikes', '/Castle/resources/images/spikes.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('scuba', '/Castle/resources/images/scuba.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('arrow', '/Castle/resources/images/arrow.png', {frameWidth: 16, frameHeight: 10});
        this.load.spritesheet('platform', '/Castle/resources/images/platform.png', {frameWidth: 32, frameHeight: 16});

        this.load.image('map', '/Castle/resources/images/map.png');
        this.load.tilemapTiledJSON('map', '/Castle/resources/map.json');

        this.load.audio('main-audio', ['/Castle/resources/audio/castle.mp3']);
        this.load.audio('die-player-audio', ['/Castle/resources/audio/die_player.mp3']);
        this.load.audio('die-monstr-audio', ['/Castle/resources/audio/die_monstr.mp3']);
        this.load.audio('collect-audio', ['/Castle/resources/audio/collect.mp3']);
        this.load.audio('open-door-audio', ['/Castle/resources/audio/open_door.mp3']);
        this.load.audio('jump-audio', ['/Castle/resources/audio/jump.mp3']);
        this.load.audio('scuba-audio', ['/Castle/resources/audio/scuba.mp3']);
    }
    create() {
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
}

export default BootScene;