abstract class Avatar {
    protected tick = 0;
    play(dt: number): void {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1
        }
    constructor(public texture: AnimatedTexture) {
    }
    toJSON() {
        return this.texture;
    }
    abstract bindContext(camera: Camera): (hitbox: Hitbox) => boolean;
}

class BaseAvatar extends Avatar {
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
}

class ReflectedAvatar extends BaseAvatar {
    protected modification(context: CanvasRenderingContext2D, hitbox: Hitbox): CanvasRenderingContext2D {
        context.translate(hitbox.width, 0)
        context.scale(-1, 1);
        return context;
    }
}

class CompositeAvatar extends Avatar {
    
    bindContext(camera: Camera): (hitbox: Hitbox) => boolean {
        let normal = this.normal.bindContext(camera);
        let reverse = this.reflect.bindContext(camera)
        return (hitbox: Hitbox) => {
            if(this.left)
                return normal(hitbox)
            return reverse(hitbox)
        }
    }

    left=true

    play(dt: number): void {
        this.left = dt>=0;
        this.normal.play(dt)
        this.reflect.play(-dt)
    }

    normal: BaseAvatar;
    reflect: ReflectedAvatar;
    constructor(texture: AnimatedTexture) {
        super(texture)
        this.normal = new BaseAvatar(texture)
        this.reflect = new ReflectedAvatar(texture)
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
            return new CompositeAvatar(t as AnimatedTexture)
        return t;
    }
}