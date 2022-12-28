const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.heigth = 150
        this.last_key
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.heigth)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.heigth + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 976,
        y: 0
    },
    velocity: {
        x: 0,
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
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.last_key= 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.last_key = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            player.last_key = 'w';
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.last_key= 'ArrowRight';
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
    console.log(event.key)
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
    console.log(event.key)
})
