class Sprite {
    constructor({position, imgSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
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
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.FramesMax),
            0,
            this.image.width / this.FramesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.FramesMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrames() {
        this.frameElapsed++
        if (this.frameElapsed % this.frameHold === 0) {
            if (this.frameCurrent < this.FramesMax - 1) {
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
                    position,
                    velocity,
                    imgSrc, scale = 1,
                    framesMax = 1,
                    offset = {x: 0, y: 0},
                    sprites,
                    attackBox = {offset: {}, width:undefined, height:undefined}
                },
    ) {
        super({
            position,
            imgSrc,
            scale,
            framesMax,
            offset,
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.last_key
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.isAttacking = false
        this.health = 100
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.frameHold = 5
        this.sprites = sprites
        this.dead = false
        this.timeOver = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        }
    }

    update() {
        this.draw();
        if (!this.dead) this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 57) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprites('attack1')
        this.isAttacking = true
        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 1000)
    }

    takeHit(){
        this.health -= 20;

        if(this.health <= 0){
            this.switchSprites('death');
        } else {
            this.switchSprites('takeHit');
        }
    }

    switchSprites(sprite) {

        // overriding death animation
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }

        // overriding attack animation
        if (this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax - 1) return

        // overriding getHit animation
        if (this.image === this.sprites.takeHit.image &&
            this.frameCurrent < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.FramesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.FramesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.FramesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.FramesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.FramesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.FramesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.FramesMax = this.sprites.death.framesMax
                    this.frameCurrent = 0
                }
                break;
        }
    }
}