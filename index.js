const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imgSrc: './img/background.png'
})
const shop = new Sprite({
    position:{
        x:365,
        y:358
    },
    imgSrc: './img/decorations/shop_anim.png',
    scale: 1.25,
    framesMax: 6
})

//player
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x: 215,
        y: 155
    },
    imgSrc: './img/Martial Hero/Sprites/Idle.png',
    scale: 2.5,
    framesMax: 8,
    sprites: {
        idle: {
            imgSrc: './img/Martial Hero/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imgSrc: './img/Martial Hero/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './img/Martial Hero/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc: './img/Martial Hero/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './img/Martial Hero/Sprites/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imgSrc: './img/Martial Hero/Sprites/Take Hit.png',
            framesMax: 4
        },
        death: {
            imgSrc: './img/Martial Hero/Sprites/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
})

//enemy
const enemy = new Fighter({
    position: {
        x: 976,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset:{
        x: 215,
        y: 170
    },
    imgSrc: './img/Martial Hero 2/Sprites/Idle.png',
    scale: 2.5,
    framesMax: 4,
    sprites: {
        idle: {
            imgSrc: './img/Martial Hero 2/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imgSrc: './img/Martial Hero 2/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './img/Martial Hero 2/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc: './img/Martial Hero 2/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './img/Martial Hero 2/Sprites/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imgSrc: './img/Martial Hero 2/Sprites/Take Hit.png',
            framesMax: 3
        },
        death: {
            imgSrc: './img/Martial Hero 2/Sprites/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 50
        },
        width: 150,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    background.update();
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    shop.update();
    player.update();
    enemy.update();

    //player move
    player.velocity.x = 0;
    if (keys.a.pressed && player.last_key === 'a') {
        player.velocity.x = -5;
        player.switchSprites('run')
    } else if (keys.d.pressed && player.last_key === 'd') {
        player.velocity.x = 5;
        player.switchSprites('run')
    } else {
        player.switchSprites('idle')
    }

    // player jumping
    if (player.velocity.y < 0){
        player.switchSprites('jump')
    } else if (player.velocity.y > 0){
        player.switchSprites('fall')
    }

    //enemy move
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.last_key === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.last_key === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprites('run')
    } else {
        enemy.switchSprites('idle')
    }

    // enemy jumping
    if (enemy.velocity.y < 0){
        enemy.switchSprites('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprites('fall')
    }

    // detect for collision
    if (rectangular_collision({
        rec1:player,
        rec2:enemy
        }) &&
        player.isAttacking && player.frameCurrent===4) {
        player.isAttacking = false;
        enemy.takeHit()
        //document.querySelector('#enemy_health').style.width = enemy.health + '%'
        gsap.to('#enemy_health', {
            width: player.health + '%'
        })
    }

    // player misses
    if(player.isAttacking && player.frameCurrent ===4){
        player.isAttacking = false;
    }

    if (rectangular_collision({
            rec1:enemy,
            rec2:player
        }) &&
        enemy.isAttacking && enemy.frameCurrent ===2) {
        enemy.isAttacking = false;
        player.takeHit()
        //document.querySelector('#player_health').style.width = player.health + '%'
        gsap.to('#player_health', {
            width: player.health + '%'
        })
    }

    // enemy misses
    if(enemy.isAttacking && enemy.frameCurrent ===2){
        enemy.isAttacking = false;
    }

    // end game over health
    if (player.health <= 0 || enemy.health <= 0){
        determineWinner({player,enemy,timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {
    // key moves
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.last_key = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.last_key = 'a';
                break;
            case 'w':
                player.velocity.y = -20;
                player.last_key = 'w';
                break;

            case ' ':
                player.attack();
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.last_key = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.last_key = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                enemy.last_key = 'ArrowUp';
                break;

            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})
