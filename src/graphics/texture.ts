abstract class AnimatedTexture extends Typeable {
    abstract draw(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number): boolean;
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

abstract class ColoredTexture extends AnimatedTexture {
    constructor(type: string, protected colorStroke?: Color, protected colorFill?: Color) {
        super(type);
    }

    protected abstract drawing(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number): void;
    draw(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number): boolean {
        this.play(progress);
        if (this.colorFill != undefined)
            context.fillStyle = this.colorFill.to_string();
        if (this.colorStroke != undefined)
            context.strokeStyle = this.colorStroke.to_string();
        this.drawing(context, hitbox, progress);
        return true;
    }
    protected play(progress: number) {}
}

class FillRectangleTexture extends ColoredTexture {
    protected drawing(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number): void {
        context.fillRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }

    constructor(color: Color) {
        super("FillRectangleTexture", undefined, color);
    }
}

class AnimatedFillRectangleTexture extends FillRectangleTexture {
    protected play(progress: number) {
        (this.colorFill as Color).R = 128+128*progress;
        (this.colorFill as Color).B = 128-128*progress;
    }
}

class StrokeRectangleTexture extends ColoredTexture {
    protected drawing(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number): void {
        context.strokeRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }

    constructor(color: Color) {
        super("StrokeRectangleTexture", color, undefined);
    }
}

class ImageTexture extends AnimatedTexture {
    bitmap!: ImageBitmap

    private loaded(): boolean {
        return this.bitmap != null;
    }

    protected drawing(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number) {
        context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }

    draw(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number): boolean {
        if (this.loaded()) {
            this.drawing(context, hitbox, progress);
            return true;
        }
        return false;
    }

    protected onload(bitmap: ImageBitmap) { }
    constructor(private filename: string, type = "ImageTexture") {
        super(type);
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

class AnimatedImageTexture extends ImageTexture {
    constructor(filename: string, public frameSize: number, type = "AnimatedImageTexture") {
        super(filename, type);
    }

    protected drawing(context: CanvasRenderingContext2D, hitbox: Hitbox, progress: number) {
        const frameCount = this.bitmap.width / this.frameSize;
        let dt = Math.floor(frameCount * progress)
        context.drawImage(
            this.bitmap, (this.frameSize + 1) * dt, 0, this.frameSize, this.frameSize,
            hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height
        );
    }
}

function chooseExist(a: any, b: any) {
    if (a)
        return a;
    return b;
}

class TextureFactory implements Factory<AnimatedTexture>{

    make(type: string, src: any): AnimatedTexture | false {
        switch (type) {
            case "FillRectangleTexture":
                return new FillRectangleTexture(chooseExist(src.color, src.colorFill));
            case "StrokeRectangleTexture":
                return new StrokeRectangleTexture(chooseExist(src.color, src.colorStroke));
            case "ImageTexture":
                return new ImageTexture(src.filename);
            case "AnimatedImageTexture":
                return new AnimatedImageTexture(src.filename, src.frameSize);
            default:
                return false;
        }
    }
}