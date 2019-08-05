abstract class Avatar extends Typeable {
    abstract bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void
    play(dt: number): void {};
}

class Color extends Typeable {
    R: number;
    G: number;
    B: number;
    A: number;

    constructor(r: number, g: number, b: number, a = 255) {
        super("Color");
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    to_string(): string {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }

    static unpack({ R, G, B, A }: { R: number, G: number, B: number, A: number }) {
        return new Color(R, G, B, A);
    }
}

class ImageAvatar extends Avatar {
    bitmap!: ImageBitmap;
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
            context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
    constructor(private filename: string) {
        super("ImageAvatar");
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => this.bitmap = bitmap);
        }
        img.src = "./static/img/" + filename;
    }
}

class RectangleAvatar extends Avatar {
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
            context.fillStyle = this.color.to_string();
            context.fillRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        }
    }
    color: Color;

    constructor(color: Color) {
        super("RectangleAvatar");
        this.color = color;
    }
}

class StrokeRectangleAvatar extends Avatar {
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
            context.strokeStyle = this.color.to_string();
            context.strokeRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        }
    }
    color: Color;

    constructor(color: Color) {
        super("StrokeRectangleAvatar");
        this.color = color;
    }
}

class ImageSource extends Typeable{
    bitmap!: ImageBitmap

    protected onload(bitmap: ImageBitmap) {}

    constructor(private filename: string) {
        super("ImageSource");
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => {
                this.bitmap = bitmap;
                this.onload(bitmap);
            });
        }
        img.src = "./static/img/" + filename;
    }
}

class AnimationSource extends ImageSource {
    constructor(filename: string) {
        super(filename);
        this._type = "AnimationSource"
    }
    protected onload(bitmap: ImageBitmap) {
        
    }
}

class AnimatedAvatar extends Typeable implements Avatar {
    private bitmap!: ImageBitmap;
    private tick = 0;
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
            if(this.bitmap) {
                const frameSize = this.bitmap.height;
                const frameCount = this.bitmap.width / frameSize;
                let dt = Math.floor(frameCount*this.tick)
                console.log(`${dt} ${frameCount} ${this.tick}`)
                context.transform
                context.drawImage(
                    this.bitmap, (frameSize+1)*dt, 0, frameSize, frameSize, 
                    hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height
                );
            };
        }
    }
 
    play(dt: number) {
        this.tick+=dt;
        if (this.tick > 1)
            this.tick-=1;
        if (this.tick < 0)
            this.tick+=1
    }

    constructor(private filename: string) {
        super("AnimatedAvatar");
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => {this.bitmap = bitmap});
        }
        img.src = "./static/img/" + filename;
    }
}
