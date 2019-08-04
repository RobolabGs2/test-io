interface Avatar {
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) =>void
}

class Color {
    R: number;
    G: number;
    B: number;
    A: number;

    constructor(r:number, g:number, b:number, a = 255) {
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    to_string(): string {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }
}

class ImageAvatar implements Avatar {
    bitmap!: ImageBitmap;
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
        context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }

    constructor(filename: string) {
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => this.bitmap = bitmap);
        }
        img.src = filename;
    }
}

class RectangleAvatar implements Avatar {
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
            context.fillStyle = this.color.to_string();
            context.fillRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        }
    }
    color: Color;

    constructor(color: Color) {
        this.color = color;
    }
}

class StrokeRectangleAvatar implements Avatar {
    bindContext(context: CanvasRenderingContext2D): (hitbox: Hitbox) => void {
        return (hitbox: Hitbox) => {
            context.strokeStyle = this.color.to_string();
            context.strokeRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        }
    }
    color: Color;

    constructor(color: Color) {
        this.color = color;
    }
}