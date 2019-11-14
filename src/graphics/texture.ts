interface AnimatedTexture {
    draw(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number): boolean;
}

interface Progressable<E> {
    progress(progress: number): E;
}

abstract class AbstractAnimatedTexture extends Typeable implements AnimatedTexture{
    abstract draw(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number): boolean;
}

abstract class ModificatorTexture extends AbstractAnimatedTexture  {
    draw(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number) {
        this.predraw(context, hitbox);
        return this.original.draw(context, hitbox, this.recalcProgress(progress));
    }
    
    protected abstract predraw(context: CanvasRenderingContext2D, hitbox: Sizeable): void;
    protected abstract recalcProgress(progress: number): number;

    constructor(private original: AnimatedTexture, _type: string) {
        super(_type)
    }
}

class ReflectModificator extends ModificatorTexture {
    protected recalcProgress(progress: number): number {
        return 1-progress;
    }

    protected predraw(context: CanvasRenderingContext2D, hitbox: Sizeable): void {
        context.translate(hitbox.width, 0)
        context.scale(-1, 1);
    }
    
    constructor(original: AnimatedTexture) {
        super(original, "ReflectModificator")
    }
}


class Color extends Typeable {
    constructor(public R: number, public G: number, public B: number, public A = 1, _type = "Color") {
        super(_type);
    }
    
    toString(): string {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }

    static unpack({ R, G, B, A }: { R: number, G: number, B: number, A: number }) {
        return new Color(R, G, B, A);
    }
}

interface AnimatedColor extends Progressable<Color> {
    progress(progress: number): Color;
}

class RedToGreen extends Typeable implements AnimatedColor {
    progress(progress: number): Color  {
        if(progress < 0)
            progress = 1 + progress;
        progress = progress - 0.5
        return new Color(255*Math.abs(2*progress), 255-255*Math.abs(2*progress), 0);
    }

    constructor() {
        super("RedToGreen");
    }
}

class Gradient implements AnimatedColor {
    dC: Color;

    progress(progress: number): Color {
        return new Color(this.from.R+progress*this.dC.R, this.from.G+progress*this.dC.G, this.from.B+progress*this.dC.B)
    }
    constructor(private from: Color, private to: Color) {
        this.dC = new Color(to.R - from.R, to.G - from.G, to.B - from.B);
    }
}

abstract class ColoredTexture extends AbstractAnimatedTexture {
    constructor(type: string, protected color: Color) {
        super(type);
    }

    protected abstract drawing(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number): void;
    draw(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number): boolean {
        this.play(progress);
        if (this.color != undefined) {
            context.fillStyle = this.color.toString();
            context.strokeStyle = this.color.toString();
        }
        this.drawing(context, hitbox, progress);
        return true;
    }
    protected play(progress: number) {}
}

class FillRectangleTexture extends ColoredTexture {
    protected drawing(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number): void {
        context.fillRect(0, 0, hitbox.width, hitbox.height);
    }
    protected play(progress: number) {
    }
    constructor(color: Color) {
        super("FillRectangleTexture", color);
    }
}

class AnimatedFillRectangleTexture extends FillRectangleTexture {
    protected play(progress: number) {
        progress = progress*2;
        if(progress>1)
            progress=2-progress
        this.color = this.animated.progress(progress)
    }

    animated: AnimatedColor;

    constructor(from = new Color(255, 128, 0), to = new Color(0, 128, 255)) {
        super(from);
        this.animated = new Gradient(from, to);
    }
}

class StrokeRectangleTexture extends ColoredTexture {
    protected drawing(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number): void {
        context.strokeRect(0, 0, hitbox.width, hitbox.height);
    }

    constructor(color: Color) {
        super("StrokeRectangleTexture", color);
    }
}

class ImageTexture extends AbstractAnimatedTexture {
    bitmap!: ImageBitmap

    private loaded(): boolean {
        return this.bitmap != null;
    }

    protected drawing(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number) {
        context.drawImage(this.bitmap, 0, 0, hitbox.width, hitbox.height);
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
        img.src = "./img/" + filename;
    }
}

class AnimatedImageTexture extends ImageTexture {
    constructor(filename: string, public frameSize: number, type = "AnimatedImageTexture") {
        super(filename, type);
    }

    protected drawing(context: CanvasRenderingContext2D, hitbox: Sizeable, progress: number) {
        const frameCount = this.bitmap.width / this.frameSize;
        let dt = Math.floor((frameCount-1) * progress)
        context.drawImage(
            this.bitmap, (this.frameSize) * dt, 0, this.frameSize, this.bitmap.height,
            0, 0, hitbox.width, hitbox.height
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