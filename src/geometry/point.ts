interface ReadonlyPoint {
    readonly x: number;
    readonly y: number;
}

class Point extends Typeable implements ReadonlyPoint {
    x: number;
    y: number;

    constructor({x = 0, y = 0}) {
        super("Point");
        this.x = x;
        this.y = y;
    }

    Revers(): Point{
        return new Point({x: this.y, y: this.x});
    }

    Sum(point: Point): Point{
        return new Point({x: this.x + point.x, y: this.y + point.y});
    }

    Neg(): Point{
        return new Point({x: -this.x, y: -this.y});
    }

    SMult(a: number) {
        return new Point({x: this.x*a, y:this.y*a});
    }

    length(): number{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class FakePoint implements ReadonlyPoint {
    constructor(private origin: ReadonlyPoint, public offset: ReadonlyPoint) {
    }

    get x() {
        return this.origin.x + this.offset.x;
    }

    get y() {
        return this.origin.y + this.offset.y;
    }
}

class MiddlePoint implements ReadonlyPoint {
    constructor(private first: ReadonlyPoint, private second: ReadonlyPoint) {
    }

    get x() {
        return (this.first.x + this.second.x)/2;
    }

    get y() {
        return (this.first.y + this.second.y)/2;
    }
}

class PointInHitbox implements ReadonlyPoint {
    private position: Point;
    constructor(private hitbox: ReadonlyHitbox) {
        this.position = new Point(hitbox.position);
    }

    get x() {
        let dx = this.hitbox.position.x - this.position.x;
        const radius = this.hitbox.width / 2;
        if(Math.abs(dx)>radius)
            this.position.x+= dx > 0 ? dx-radius : dx+radius
        return this.position.x;
    }

    get y() {
        let dy = this.hitbox.position.y - this.position.y;
        const radius = this.hitbox.height / 2;
        if(Math.abs(dy)>radius)
            this.position.y+= dy > 0 ? dy-radius : dy+ radius
        return this.position.y;
    }
}