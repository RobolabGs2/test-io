interface MoveAvatar {
    // dt -1..1 - пройденное расстояние в процентах от размера тела/одного шага
    move(dt: number, direction: Direction): void;
    drawHitbox(hitbox: Hitbox, camera: Camera): boolean;
    readonly moveRight: AnimatedTexture;
    readonly moveLeft: AnimatedTexture;
}

enum Direction {
    stop, left, right
}

interface AvatarState {
    direction: Direction;
    tick: number;
    play(dt: number): void;
}

class AvatarState implements AvatarState {
    play(dt: number): void {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1
    }

    constructor({tick = 0, direction = Direction.stop}) {
        this.tick = tick;
        this.direction = direction;
    }
}

abstract class Avatar implements MoveAvatar {
    abstract move(dt: number, direction: Direction): void;
    state = new AvatarState({});

    constructor(public moveRight: AnimatedTexture, public moveLeft: AnimatedTexture) {
    }
    toJSON() {
        return undefined //this.texture;
    }
    abstract drawHitbox(hitbox: Hitbox, camera: Camera): boolean;
}


function speedToDirection(speed: number) {
    if (speed === 0)
        return Direction.stop;
    return speed < 0 ? Direction.left : Direction.right
}

class CompositeAvatar extends Avatar {
    
    drawHitbox(hitbox: Hitbox, camera: Camera) {
        switch (this.state.direction) {
            case Direction.left:
                return camera.draw(hitbox.position, 
                    (context) => this.moveLeft.draw(context, hitbox, this.state.tick))
            case Direction.stop:
            case Direction.right:
                return camera.draw(hitbox.position, 
                   (context) => this.moveRight.draw(context, hitbox, this.state.tick))
        }
    }

    move(dt: number, direction: Direction): void {
        this.state.direction = 
            direction == Direction.stop ? this.state.direction : direction;
        this.state.play(dt);
    }
  
    constructor(moveRight: AnimatedTexture, moveLeft?: AnimatedTexture) {
        super(moveRight, moveLeft ? moveLeft : new ReflectModificator(moveRight));
    }
}

class CaudateAvatar implements MoveAvatar {
    move(dt: number, direction: Direction): void {
        this.main.move(dt, direction);
    }
    get moveRight(): AnimatedTexture {
        return this.main.moveRight
    }
    get moveLeft(): AnimatedTexture {
        return this.main.moveLeft
    }
    private tail: CompositeAvatar;
    constructor(private main: CompositeAvatar, tail?: CompositeAvatar, tailSize = 20) {
        this.tail = tail ? tail : new CompositeAvatar(main.moveRight, main.moveLeft);
        this.history = new RingBuffer(tailSize);
    }

    history: RingBuffer<{state: AvatarState, hitbox: Hitbox}>;
    //counter = 0;
    
    drawHitbox(hitbox: Hitbox, camera: Camera) {
        
        this.history.forEach( history => {
            this.tail.state = history.state;
            this.tail.drawHitbox(history.hitbox, camera);
        });
        
        this.main.drawHitbox(hitbox, camera)
        //this.counter++;
        //if(this.counter > -1) {
            this.history.put({
                state: new AvatarState(this.main.state), 
                hitbox: new Hitbox(new Point(hitbox.position), hitbox.width, hitbox.height)})
            //this.counter = 0;
        //}
        return true;
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