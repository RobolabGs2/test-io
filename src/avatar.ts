interface Avatar {
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) =>void
}

class Color extends Typeable {
    R: number;
    G: number;
    B: number;
    A: number;

    constructor(r:number, g:number, b:number, a = 255) {
        super("Color");
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    to_string(): string {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }

    static unpack({R, G, B, A}:{R:number, G:number, B:number, A:number}) {
        return new Color(R, G, B, A);
    }
}

class ImageAvatar extends Typeable implements Avatar {
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
        img.src = "./static/img/"+filename;
    }


}

class RectangleAvatar extends Typeable implements Avatar {
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

class StrokeRectangleAvatar extends Typeable implements Avatar {
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