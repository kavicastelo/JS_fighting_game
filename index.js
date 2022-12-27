const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.heigth = 150
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.heigth)
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        if (this.position.y + this.heigth + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else{
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

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
}

animate();
