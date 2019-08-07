"use strict";
class Camera {
    constructor(context, hitbox = new Hitbox(new Point({}), 512, 512), offset = new Point({})) {
        this.context = context;
        this.hitbox = hitbox;
        this.offset = offset;
        let center = hitbox.center();
        context.translate(center.x, center.y);
    }
    setPosition(position, offset = new Point({})) {
        this.hitbox.position = position;
        this.offset = offset;
    }
    get position() {
        return new Point(this.hitbox.position.Sum(this.offset));
    }
    toJSON() {
        return undefined;
    }
    clear() {
        this.context.fillStyle = "#000";
        this.context.fillRect(-this.hitbox.width / 2, -this.hitbox.height / 2, this.hitbox.width, this.hitbox.height);
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
    constructor(texture) {
        this.texture = texture;
        this.tick = 0;
    }
    modification(context, hitbox) {
        return context;
    }
    bindContext(camera) {
        return hitbox => {
            const context = camera.context;
            context.save();
            context.translate(-camera.position.x + hitbox.position.x, -camera.position.y + hitbox.position.y);
            let b = this.texture.draw(this.modification(context, hitbox), hitbox, this.tick);
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
class ReflectedAvatar extends Avatar {
    modification(context, hitbox) {
        context.translate(hitbox.width, 0);
        context.scale(-1, 1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBoaWNzL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxNQUFNO0lBQ1IsWUFBbUIsT0FBaUMsRUFBUyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBUyxTQUFTLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUFySCxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXNDO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDcEksSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQzVCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDekMsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFlLEVBQUUsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUE7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtB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