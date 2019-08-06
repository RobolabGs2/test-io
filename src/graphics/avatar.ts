class Avatar {
    private tick = 0;

    protected modification(context: CanvasRenderingContext2D): CanvasRenderingContext2D {
        return context;
    }

    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => boolean {
        return hitbox => {
            context.save();
            let b = this.texture.draw(this.modification(context), hitbox, this.tick);
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

//todo учитывать хитбокс и нормально отражать, а не всё целиком
class ReflectedAvatar extends Avatar {
    protected modification(context: CanvasRenderingContext2D): CanvasRenderingContext2D {
        context.scale(-1, 1);
        context.translate(-512, 0)
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