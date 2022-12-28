const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.last_key
        this.attackBox = {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if(this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }

    attack () {
        this.isAttacking = true
        setTimeout(()=>{
            this.isAttacking = false;
        },100)
    }
}

//player
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    }
})

//enemy
const enemy = new Sprite({
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
        x: -50,
        y: 0
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

function rectangular_collision( {rec1, rec2} ){
    return(
        rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
        rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
        rec1.attackBox.position.y + rec1.height >= rec2.position.y &&
        rec1.attackBox.position.y <= rec2.position.y + rec2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //player move
    player.velocity.x = 0;
    if (keys.a.pressed && player.last_key === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.last_key === 'd') {
        player.velocity.x = 5;
    }

    //enemy move
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.last_key === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.last_key === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // detect for collision
    if (rectangular_collision({
        rec1:player,
        rec2:enemy
        }) &&
        player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemy_health').style.width = enemy.health + '%'
    }

    if (rectangular_collision({
            rec1:enemy,
            rec2:player
        }) &&
        enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#player_health').style.width = player.health + '%'
    }
}

animate();

window.addEventListener('keydown', (event) => {
    // key moves
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
        case 'ArrowDown':
            enemy.attack();
            break;

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
