import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene', active: false});
    }

    preload() {

    }

    create() {
        this.cursor = this.input.keyboard.createCursorKeys();

        /* Подготовка звуков */

        if(!this.mainAudio) this.mainAudio = this.sound.add('main-audio');
        if(!this.diePlayerAudio) this.diePlayerAudio = this.sound.add('die-player-audio');
        if(!this.dieMonstrAudio) this.dieMonstrAudio = this.sound.add('die-monstr-audio');
        if(!this.collectAudio) this.collectAudio = this.sound.add('collect-audio');
        if(!this.openDoorAudio) this.openDoorAudio = this.sound.add('open-door-audio');
        if(!this.jumpAudio) this.jumpAudio = this.sound.add('jump-audio');
        if(!this.scubaAudio) this.scubaAudio = this.sound.add('scuba-audio');
        this.scubaAudio.loop = true;
        this.mainAudio.loop = true;
        this.mainAudio.play();
        /* Подготовка звуков */

        /* Подготовка карты */
        this.map = this.make.tilemap({key: 'map'});
        let tileset = this.map.addTilesetImage('map');
        this.layerBlock = this.map.createLayer('block', tileset);
        this.map.setCollision(1, true);
        this.layerWater = this.map.createLayer('water', tileset);
        this.map.setCollision(2, true);
        /* Подготовка карты */

        this.bag = {
            keys: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            },
            scuba: 0,
        }
        for(let k in this.bag.keys) this.events.emit('changeKey', k, 0);
        this.events.emit('offScuba');

        
        /* Создание персонажа */
        let resp = this.map.getObjectLayer('resp')['objects'];
        this.player = this.physics.add.sprite(resp[0].x + resp[0].width/2, resp[0].y - resp[0].height/2, 'player', 3);
        this.player.setBounce(0);
        this.player.isAttackLeft = false;
        this.player.isAttackRight = false;
        this.player.isAttack = false;
        this.player.isAlive = true;
        this.player.isScuba = false;


        this.anims.create({
            key: 'player-left',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'player-idle',
            frames: [{key: 'player', frame: 3}],
            frameRate: 5
        });
        this.anims.create({
            key: 'player-jump',
            frames: [{key: 'player', frame: 8}],
            frameRate: 5
        });
        this.anims.create({
            key: 'player-jump-left',
            frames: [{key: 'player', frame: 7}],
            frameRate: 5
        });
        this.anims.create({
            key: 'player-jump-right',
            frames: [{key: 'player', frame: 9}],
            frameRate: 5
        });
        this.anims.create({
            key: 'player-right',
            frames: this.anims.generateFrameNumbers('player', {start: 4, end: 6}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'player-attack-left',
            frames: [{key: 'player-attack', frame: 0}],
            frameRate: 5
        });
        this.anims.create({
            key: 'player-attack-right',
            frames: [{key: 'player-attack', frame: 1}],
            frameRate: 5
        });
        this.anims.create({
            key: 'player-die',
            frames: this.anims.generateFrameNumbers('player', {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.layerBlock);
        this.physics.add.overlap(this.player, this.layerWater, this.swimming, null, this);
        /* Создание персонажа */

        /* Создание ключей */
        this.keys = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('keys')['objects'].forEach(obj => {
            let key = this.keys.create(obj.x + obj.width/2, obj.y - obj.height/2, 'keys', obj.type);
            key.type = obj.type;
        });
        this.physics.add.overlap(this.player, this.keys, this.collectKey, null, this);
        /* Создание ключей */

        /* Создание дверей */
        this.doors = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('doors')['objects'].forEach(obj => {
            let door = this.doors.create(obj.x + obj.width/2, obj.y - obj.height/2, 'doors', obj.type);
            door.type = obj.type;
        });
        this.physics.add.collider(this.player, this.doors, this.openDoor, null, this);
        /* Создание дверей */

        /* Создание мостов */
        this.anims.create({
            key: 'bridge-active',
            frames: this.anims.generateFrameNumbers('bridges', {start: 1, end: 2}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'bridge-idle',
            frames: [{key: 'bridges', frame: 0}],
            frameRate: 5
        });
        this.bridges = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.map.getObjectLayer('bridges')['objects'].forEach(obj => {
            this.bridges.create(obj.x + obj.width/2, obj.y - obj.height/2, 'bridges');
        });
        this.bridges.playAnimation('bridge-active');

        this.bridgeCollider = this.physics.add.collider(this.player, this.bridges);

        if (this.bridgeTimer) clearInterval(this.bridgeTimer);
        this.bridgeTimer = setInterval(() => {
            if (!this.bridgeCollider.active) {
                this.bridges.playAnimation('bridge-active');
                this.bridgeCollider.active = true;

            } else {
                this.bridges.playAnimation('bridge-idle');
                this.bridgeCollider.active = false;
            }
        }, 5000);
        /* Создание мостов */

        /* Создание платформ */
        this.platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        }).setOrigin(0, 1);

        this.map.getObjectLayer('platforms')['objects'].forEach(obj => {
            this.platforms.create(obj.x + obj.width/2, obj.y - obj.height/2, 'platform');
        });
        this.platforms.setVelocityX(100);
        this.physics.add.collider(this.platforms, this.layerBlock, this.platformMove, null, this);
        this.physics.add.collider(this.player, this.platforms);
        /* Создание платформ */

        /* Создание кольев */
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.map.getObjectLayer('spikes')['objects'].forEach(obj => {
            this.spikes.create(obj.x + obj.width/2, obj.y - obj.height/2, 'spikes', obj.type);
        });
        this.physics.add.collider(this.player, this.spikes, this.playerDieOfSpike, null, this);
        /* Создание кольев */

        /* Создание акваланга */
        this.scuba = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.map.getObjectLayer('scuba')['objects'].forEach(obj => {
            this.scuba.create(obj.x + obj.width/2, obj.y - obj.height/2, 'scuba');
        });
        this.physics.add.overlap(this.player, this.scuba, this.collectScuba, null, this);
        if (this.scubaTimer) clearInterval(this.scubaTimer);
        this.scubaTimer = setInterval(() => {
            if (this.bag.scuba > 0) {
                this.bag.scuba--
                if (this.bag.scuba <= 0) {
                    this.events.emit('offScuba', this.bag.scuba);
                    this.player.isScuba = false;
                    this.mainAudio.play();
                    this.scubaAudio.stop();
                }
            }
        }, 1000);
        /* Создание акваланга */

        /* Создание стрел */
        this.arrows = this.physics.add.group({
            allowGravity: false,
            //immovable: true
        });
        this.physics.add.collider(this.arrows, this.layerBlock, this.arrowMove, null, this);
        this.physics.add.collider(this.arrows, this.doors, this.arrowMove, null, this);
        this.physics.add.collider(this.player, this.arrows, this.playerVsArrow, null, this);
        /* Создание стрел */

        /* Создание моснтров */
        this.anims.create({
            key: 'monstr-cat-left',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 0, end: 1}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-cat-right',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 2, end: 3}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-knight-left',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 4, end: 5}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-knight-right',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 6, end: 7}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-arrow-left',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 8, end: 9}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-arrow-right',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-wizard-left',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 12, end: 13}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monstr-wizard-right',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 14, end: 15}),
            frameRate: 5,
            repeat: -1
        });
        let monstrDieAnimation = this.anims.create({
            key: 'monstr-die',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 16, end: 17}),
            frameRate: 5,
            repeat: 0
        });
        this.anims.create({
            key: 'monstr-create',
            frames: this.anims.generateFrameNumbers('monstrs', {start: 18, end: 19}),
            frameRate: 5,
            repeat: 0
        });


        this.monstrs = this.physics.add.group({
            bounceX: 1
        });


        this.map.getObjectLayer('monstrs')['objects'].forEach(obj => {
            let monstr = this.monstrs.create(obj.x + obj.width/2, obj.y - obj.height/2, 'monstrs');
            monstr.type = obj.type;
            monstr.setVelocityX(100);
        });
        this.physics.add.collider(this.monstrs, this.layerBlock, this.monstrMove, null, this);
        this.physics.add.collider(this.monstrs, this.doors, this.monstrMove, null, this);
        this.physics.add.collider(this.monstrs, this.monstrs, this.monstrMove, null, this);
        this.physics.add.collider(this.monstrs, this.platforms, this.monstrMove, null, this);
        this.physics.add.collider(this.monstrs, this.layerWater, this.monstrDieOf, null, this);
        this.physics.add.overlap(this.monstrs, this.spikes, this.monstrDieOf, null, this);

        this.physics.add.overlap(this.player, this.monstrs, this.playerVsMonstr, null, this);

        if (this.monstrTimer) clearInterval(this.monstrTimer);
        this.monstrTimer = setInterval(() => {
            this.monstrs.children.entries.forEach(monstr => {
                if(monstr.type === 'arrow' && monstr.body.enable){
                    if(monstr.body.velocity.x > 0) {
                        let arrow = this.arrows.create(monstr.x+monstr.width+10, monstr.y, 'arrow', 1);
                        arrow.setVelocityX(200);
                    }
                    if(monstr.body.velocity.x < 0) {
                        let arrow = this.arrows.create(monstr.x-10, monstr.y, 'arrow', 0);
                        arrow.setVelocityX(-200);
                    }
                }
                if(monstr.type === 'wizard'){
                    if(Math.sqrt(((monstr.x - this.player.x) ** 2) + ((monstr.y - this.player.y) ** 2)) <= 160){
                        if(monstr.x > this.player.x){
                            let m = this.monstrs.create(monstr.x-monstr.width*2, monstr.y-monstr.height/2, 'monstrs');
                            m.anims.play('monstr-create', true);
                            m.setVelocityX(-100);
                            m.type = 'cat';
                        } else {
                            let m = this.monstrs.create(monstr.x+monstr.width*2, monstr.y-monstr.height/2, 'monstrs');
                            m.anims.play('monstr-create', true);
                            m.setVelocityX(100);
                            m.type = 'cat';
                        }

                    }
                }
            })
        }, 3000);
        /* Создание монстров */

        /* Камера */
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
        /* Камера */

       
    }

    update() {
        if (this.player.isAlive) {
            if (!this.player.isAttackLeft && !this.player.isAttackRight) {
                if (this.cursor.left.isDown) {
                    this.player.setVelocityX(-100);
                } else if (this.cursor.right.isDown) {
                    this.player.setVelocityX(100);
                } else {
                    this.player.setVelocityX(0);
                }

                if (this.cursor.up.isDown && this.player.body.blocked.down && this.player.body.velocity.y === 0) {
                    this.player.setVelocityY(-200);
                    this.monstrs.children.entries.forEach(monstr => {
                        if(monstr.type === 'cat' && monstr.body.velocity.y ===0) monstr.setVelocityY(-200);
                    })
                    this.jumpAudio.play();
                }

                if (!this.player.body.blocked.down) {
                    if (this.player.body.velocity.x > 0) this.player.anims.play('player-jump-right', true);
                    if (this.player.body.velocity.x < 0) this.player.anims.play('player-jump-left', true);
                    if (this.player.body.velocity.x === 0) this.player.anims.play('player-jump', true);
                } else {
                    if (this.player.body.velocity.x > 0) this.player.anims.play('player-right', true);
                    if (this.player.body.velocity.x < 0) this.player.anims.play('player-left', true);
                    if (this.player.body.velocity.x === 0) this.player.anims.play('player-idle', true);
                }

                if (!this.player.isAttack && this.cursor.space.isDown && this.player.body.blocked.down && this.player.body.velocity.y === 0) {
                    if (this.player.body.velocity.x > 0) {
                        this.player.anims.play('player-attack-right', true);
                        this.player.isAttackRight = true;
                        this.player.isAttack = true;
                        this.player.body.setSize(0, 0, 42, 32);
                    }
                    if (this.player.body.velocity.x < 0) {
                        this.player.anims.play('player-attack-left', true);
                        this.player.isAttackLeft = true;
                        this.player.isAttack = true;
                        this.player.body.setSize(0, 0, 42, 32);
                    }
                    this.player.setVelocityX(0);
                    setTimeout(() => {
                        this.player.isAttackRight = false;
                        this.player.isAttackLeft = false;
                        if (this.player.body.velocity.x === 0) this.player.anims.play('player-idle', true);
                        this.player.body.setSize(0, 0, 32, 32);
                        setTimeout(() => {
                            this.player.isAttack = false;
                        }, 400);
                    }, 400);
                }
            }
        } else {

        }
    }

    collectKey(p, k) {
        this.collectAudio.play();
        this.bag.keys[k.type]++;
        this.events.emit('changeKey', k.type, this.bag.keys[k.type]);
        k.destroy();
    }

    openDoor(p, d) {
        if (this.bag.keys[d.type] > 0) {
            this.openDoorAudio.play();
            this.bag.keys[d.type]--;
            this.events.emit('changeKey', d.type, this.bag.keys[d.type]);
            d.destroy();
        }
    }

    playerDieOfSpike(p, s) {
        this.playerDie();
    }

    monstrDieOf(m, s) {
        this.monstrDie(m);
    }

    playerVsMonstr(p, m) {
        if (p.isAttackLeft && p.body.touching.left && m.type !== 'knight') {
            this.monstrDie(m);
        } else if (p.isAttackRight && p.body.touching.right && m.type !== 'knight') {
            this.monstrDie(m);
        } else {
            this.playerDie();
        }
    }
    playerVsArrow(p, a) {
        a.destroy();
        this.playerDie();
    }

    monstrMove(m, obj) {
        if (!this.layerBlock.getTileAtWorldXY(m.x - m.width/2 - 1, m.y + m.height/2 + 1)) {
            m.setVelocityX(100);
        }
        if (!this.layerBlock.getTileAtWorldXY(m.x + m.width/2 + 1, m.y + m.height/2 + 1)) {
            m.setVelocityX(-100);
        }

        if (m.body.velocity.x > 0) m.anims.play(`monstr-${m.type}-right`, true);
        if (m.body.velocity.x < 0) m.anims.play(`monstr-${m.type}-left`, true);
    }

    platformMove(p, b) {
        if (p.body.blocked.left) p.setVelocityX(100);
        if (p.body.blocked.right) p.setVelocityX(-100);
    }

    collectScuba(p, s) {
        this.mainAudio.stop();
        this.collectAudio.play();
        this.scubaAudio.play();
        this.bag.scuba = 15;
        this.events.emit('onScuba');
        p.isScuba = true;
        s.destroy();
    }

    swimming(p, w) {
        if (w.index === 2) {
            if (!p.isScuba) this.playerDie();
        }
    }

    playerDie() {
        this.mainAudio.stop();
        this.scubaAudio.stop();
        this.diePlayerAudio.play();
        this.player.isAlive = false;
        this.player.body.enable = false;
        this.player.anims.play('player-die', true);
        this.diePlayerAudio.on('complete', () => {
            this.scene.restart();
        });
    }
    arrowMove(a, obj){
        a.destroy();
    }
    monstrDie(m) {
        this.dieMonstrAudio.play();
        m.anims.play('monstr-die', true);
        m.body.enable = false;
        m.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            m.destroy();
        }, this);
    }
}

export default GameScene;