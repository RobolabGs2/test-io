interface Sizeable {
    readonly width: number;
    readonly height: number;
}

interface ReadonlyHitbox extends Sizeable {
    readonly position: ReadonlyPoint;
}

class ReadonlyHitbox implements ReadonlyHitbox {
    constructor(public readonly position: ReadonlyPoint, public readonly width: number, public readonly height: number) {
    }
    center() {return new Point({x:(this.position.x + this.width/2), y:(this.position.y + this.height/2)})}

}

class Hitbox extends Typeable  {
    constructor(public readonly position: Point, public width: number, public height: number) {
        super("Hitbox");
    }

    get x1() {return this.position.x}
    get x2() {return this.position.x + this.width}
    get y1() {return this.position.y}
    get y2() {return this.position.y + this.height}
    center() {return new Point({x:(this.position.x + this.width/2), y:(this.position.y + this.height/2)})}

    static unpack({position, width, height}: {position: Point, width: number, height: number}) {
        return new Hitbox(position, width, height);
    }
}