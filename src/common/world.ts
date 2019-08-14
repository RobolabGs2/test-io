interface Drawable {
    draw(camera: Camera): void;
}

interface DrawableMaker {
    makeDrawable(): Drawable;
}

interface Operable {
    controllerType: string;
}

class NotSerialasableDrawable implements Drawable{
    draw: (camera: Camera) => void;
    constructor(draw: (camera: Camera) => void) {
        this.draw = draw;
    }

    toJSON(){ return undefined; }
}

class Entity extends Typeable implements DrawableMaker, Operable{
    makeDrawable(): Drawable {
        return new NotSerialasableDrawable((camera)=>this.avatar.drawHitbox(this.hitbox, camera));
    }

    tick(dt: number) {
        this.avatar.move(this.body.velocity.x*dt/this.body.hitbox.width, speedToDirection(this.body.runSpeed))
    }

    get hitbox() {return this.body.hitbox}

    constructor(public avatar: MoveAvatar, public body: IBody, public controllerType: string) {
        super("Entity");
        this.body.appendix = this;
    }
}

class World extends Typeable {
    
    keepTrackOf(traceable: Entity) {
        this.camera.setPosition(traceable.hitbox.position, new Point({x:traceable.hitbox.width/2, y:traceable.hitbox.height/2}));
    }
    
    draw(): void {
        this.camera.clear()
        this.drawables.forEach(mob => {
            mob.draw(this.camera);
        });
    }

    mobs: Array<Entity>;
    drawables = new Array<Drawable>();
    physics: IPhysics;
    controller: Controller;
    materials: ResourceManager<physicalMaterial>;

    constructor(physics: IPhysics, private camera: Camera, controllerMaker: (world: World)=>Controller) {
        super("World");
        this.mobs = new Array<Entity>();
        this.physics = physics;
        this.materials = new ResourceManager();
        this.controller = controllerMaker(this);
    }

    tick(dt: number){
        this.physics.tick(dt);
        this.controller.tick(dt);
        this.mobs.forEach(m => m.tick(dt));
    }

    private pushEntity(entity: Entity) {
        this.mobs.push(entity);
        this.pushDrawable(entity);
    }

    createEntity({avatar, controllerType, body:{hitbox, material, movable = true}}:
                {avatar: MoveAvatar, controllerType: string, body:{hitbox: Hitbox, material: string, movable: boolean}}){
        let entity = new Entity(avatar, this.physics.createBody(hitbox, new Point({}), this.materials.get(material), movable), controllerType);
        this.controller.setControl(entity, controllerType);

        this.pushEntity(entity);
        return entity;
    }

    pushDrawable(drawable: Drawable|DrawableMaker) {
        if(!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.push(drawable);
    }

    pushMaterial(name: string, material: physicalMaterial) {
        this.materials.set(name, material);
    }

    toJSON() {
        return this.mobs;
    }
}