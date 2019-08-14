interface MoveAvatar {
    move(dt: number, direction: Direction): void;
    drawHitbox(hitbox: Hitbox, camera: Camera): boolean;
    moveRight: AnimatedTexture;
    moveLeft: AnimatedTexture;
}

abstract class Avatar implements MoveAvatar {
    abstract move(dt: number, direction: Direction): void;
    protected tick = 0;
    play(dt: number): void {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1
        }
    constructor(public moveRight: AnimatedTexture, public moveLeft: AnimatedTexture) {
    }
    toJSON() {
        return undefined //this.texture;
    }
    abstract drawHitbox(hitbox: Hitbox, camera: Camera): boolean;
}

enum Direction {
    stop, left, right
}

function speedToDirection(speed: number) {
    if (speed === 0)
        return Direction.stop;
    return speed < 0 ? Direction.left : Direction.right
}

class CompositeAvatar extends Avatar{
    
    drawHitbox(hitbox: Hitbox, camera: Camera) {
        switch (this.direction) {
            case Direction.left:
                return camera.draw(hitbox.position, 
                    (context) => this.moveLeft.draw(context, hitbox, 1-this.tick))
            case Direction.stop:
            case Direction.right:
                return camera.draw(hitbox.position, 
                   (context) => this.moveRight.draw(context, hitbox, this.tick))
        }
    }

    direction = Direction.stop;

    move(dt: number, direction: Direction): void {
        this.direction = direction == Direction.stop ? this.direction : direction;
        this.play(dt);
    }
  
    constructor(moveRight: AnimatedTexture, moveLeft?: AnimatedTexture) {
        super(moveRight, moveLeft ? moveLeft : new ReflectModificator(moveRight));
    }
}

interface Factory<E> {
    make(type: string, src: any): E | false;
}

class AvatarFactory implements Factory<MoveAvatar>{
    textureFactory = new TextureFactory();
    make(type: string, src: any): MoveAvatar|false {
        let t = this.textureFactory.make(type, src);
        if(t != false)
            return new CompositeAvatar(t as AnimatedTexture)
        return t;
    }
}