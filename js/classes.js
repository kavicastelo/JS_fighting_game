class Sprite {
    constructor({position, imgSrc, scale=1, framesMax = 1}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.FramesMax = framesMax
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.frameHold = 5
    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.FramesMax),
            0,
            this.image.width / this.FramesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.FramesMax) * this.scale,
            this.image.height * this.scale)
    }

    update() {
        this.draw();
        this.frameElapsed++
        if (this.frameElapsed % this.frameHold === 0) {
            if (this.frameCurrent < this.FramesMax - 1) {
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }
}

class Fighter {
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
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 57) {
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