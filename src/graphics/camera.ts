class Camera {
    private hitbox: Hitbox;
    private offset = new Point({})
    public readonly context: CanvasRenderingContext2D
    constructor(public mainCanvas: HTMLCanvasElement, size?: Sizeable) {
        if(!size)
        {
            size = {width: mainCanvas.clientWidth, height: mainCanvas.clientHeight}
        }
        console.log(`Camera width: ${size.width}, height: ${size.height}`)
        this.mainCanvas.width = size.width;
        this.mainCanvas.height = size.height;
        this.context = this.mainCanvas.getContext("2d") as CanvasRenderingContext2D;
        this.hitbox =  new Hitbox(new Point({}), size.width, size.height);
        let center = this.hitbox.center();
        this.context.translate(center.x, center.y)
    }

    setPosition(position: Point, offset = new Point({})) {
        this.hitbox.position = position;
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
        return new Point(this.hitbox.position.Sum(this.offset));
    }

    toJSON() {
        return undefined;
    }

    clear() {
        this.context.fillStyle = "#000"
        this.context.fillRect(-this.hitbox.width/2*this._scale, -this.hitbox.height/2*this._scale, this.hitbox.width*this._scale, this.hitbox.height*this._scale);
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
