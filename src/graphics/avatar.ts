class Camera {
    constructor(public context: CanvasRenderingContext2D, public hitbox = new Hitbox(new Point({}), 512, 512), public offset = new Point({})) {
        let center = hitbox.center()
        context.translate(center.x, center.y)
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

class Avatar {
    private tick = 0;

    protected modification(context: CanvasRenderingContext2D, hitbox: Hitbox): CanvasRenderingContext2D {
        return context;
    }

    bindContext(camera: Camera): (hitbox: Hitbox) => boolean {
        return hitbox => {
            const context = camera.context;
            context.save();
            context.translate(- camera.position.x + hitbox.position.x, - camera.position.y + hitbox.position.y)
            let b = this.texture.draw(this.modification(context, hitbox), hitbox, this.tick);
            context.restore();
            return b;
        };
    }

    play(dt: number): void {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1
    }

    constructor(public texture: AnimatedTexture) { }

    toJSON() {
        return this.texture;
    }
}

class ReflectedAvatar extends Avatar {
    protected modification(context: CanvasRenderingContext2D, hitbox: Hitbox): CanvasRenderingContext2D {
        context.translate(hitbox.width, 0)
        context.scale(-1, 1);
        return context;
    }
}


interface Factory<E> {
    make(type: string, src: any): E | false;
}

class AvatarFactory implements Factory<Avatar>{
    textureFactory = new TextureFactory();
    make(type: string, src: any): Avatar|false {
        let t = this.textureFactory.make(type, src);
        if(t != false)
            return new Avatar(t as AnimatedTexture)
        return t;
    }

}