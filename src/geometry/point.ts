class Point extends Typeable {
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

    length(): number{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}