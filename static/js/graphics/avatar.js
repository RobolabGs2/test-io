"use strict";
class Avatar {
    constructor(texture) {
        this.texture = texture;
        this.tick = 0;
    }
    modification(context) {
        return context;
    }
    bindContext(context) {
        return hitbox => {
            context.save();
            let b = this.texture.draw(this.modification(context), hitbox, this.tick);
            context.restore();
            return b;
        };
    }
    play(dt) {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1;
    }
    toJSON() {
        return this.texture;
    }
}
//todo учитывать хитбокс и нормально отражать, а не всё целиком
class ReflectedAvatar extends Avatar {
    modification(context) {
        context.scale(-1, 1);
        context.translate(-512, 0);
        return context;
    }
}
class AvatarFactory {
    constructor() {
        this.textureFactory = new TextureFactory();
    }
    make(type, src) {
        let t = this.textureFactory.make(type, src);
        if (t != false)
            return new Avatar(t);
        return t;
    }
}
