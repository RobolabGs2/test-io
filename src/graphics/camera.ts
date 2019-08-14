class Camera {
    private _position: Point;
    private size: Sizeable;
    private offset = new Point({})
    public readonly context: CanvasRenderingContext2D
    constructor(public mainCanvas: HTMLCanvasElement, size?: Sizeable) {
        this.size = size ? size : {width: mainCanvas.clientWidth, height: mainCanvas.clientHeight};
        console.log(`Camera width: ${this.size.width}, height: ${this.size.height}`);
        this.mainCanvas.width = this.size.width;
        this.mainCanvas.height = this.size.height;
        this.context = this.mainCanvas.getContext("2d") as CanvasRenderingContext2D;
        this._position =  new Point({});
        this.context.translate(this.position.x + this.size.width/2, this.position.y + this.size.height/2)
    }

    setPosition(position: Point, offset = new Point({})) {
        this._position = position;
        this.offset = offset;
    }

    _scale = 1;

    scale(delta: number) {
        let new_scale = (this._scale+delta)
        const newLocal = this._scale / new_scale;
        if(new_scale<=0.0001)
            return
        this.context.scale(newLocal, newLocal);
        this._scale = new_scale
    }

    get position() {
        return new Point(this._position.Sum(this.offset));
    }

    xy2uv(xy: Point) {
        return xy.Sum(this.position.Neg())
    }

    uv2xy(uv: Point) {
        return uv.Sum(this.position)
    }

    canvas2xy(canvas: Point) {
        let xy = canvas.Sum(new Point({x: -this.size.width/2, y: -this.size.height/2}));
        xy.x*= this._scale;
        xy.y*= this._scale;
        let position = this.position
        xy.x+=position.x
        xy.y+=position.y
        return xy;
    }

    screen2uv(screen: Point) {
        return screen
            .SMult(this._scale)
    }

    toJSON() {
        return undefined;
    }

    draw(where: Point, how: (context: CanvasRenderingContext2D) => boolean) {
        this.context.save();
        let uv = this.xy2uv(where);
        this.context.translate(uv.x, uv.y);
        let b = how(this.context);
        this.context.restore();
        return b;
    }

    clear() {
        this.context.fillStyle = "#000"
        this.context.fillRect(
            -this.size.width/2*this._scale, -this.size.height/2*this._scale, 
            this.size.width*this._scale, this.size.height*this._scale);
        //this.context.clearRect(0, 0, 256, 256);
        /*
        this.context.lineWidth = 5
        this.context.beginPath()
        this.context.moveTo(-this.hitbox.width/2, -this.hitbox.height/2)
        this.context.lineTo(this.hitbox.width, this.hitbox.height)
        this.context.moveTo(-this.hitbox.width/2, this.hitbox.height/2)
        this.context.lineTo(this.hitbox.width, -this.hitbox.height)
        this.context.stroke()*/
    }
}
