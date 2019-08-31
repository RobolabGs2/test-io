interface DeathListener<T extends Deadly> {
    (corpse: T): void;
}

interface Deadly {
    die(): void;
    addDeathListener(listener: DeathListener<this>): void;
}

interface Drawable extends Deadly {
    draw(camera: Camera): void;
}

interface DrawableMaker {
    makeDrawable(): Drawable;
}

interface Operable {
    controllerType: string;
}

class NotSerialasableDrawable implements Drawable {
    addDeathListener(listener: DeathListener<this>): void {
        this.ondie.push(listener);
    }
    draw: (camera: Camera) => void;
    
    private ondie = new Array<DeathListener<this>>();

    constructor(draw: (camera: Camera) => void) {
        this.draw = draw;
    }

    die() {
        this.ondie.forEach(x => x(this));
    }
    toJSON(){ return undefined; }
}

class Entity extends Typeable implements DrawableMaker, Operable, Deadly {
    addDeathListener(listener: DeathListener<this>): void {
        this.ondie.push(listener);
    }

    private ondie = new Array<DeathListener<this>>();
    drawable: NotSerialasableDrawable;
    makeDrawable(): Drawable {
        return this.drawable;
    }

    tick(dt: number) {
        this.avatar.move(this.body.velocity.x*dt/this.body.hitbox.width, speedToDirection(this.body.runSpeed))
    }

    die(){
        this.drawable.die();
        this.ondie.forEach(x=>x(this));
    }

    get hitbox() {return this.body.hitbox}

    constructor(public avatar: MoveAvatar, public body: IBody, public controllerType: string) {
        super("Entity");
        this.body.appendix = this;
        this.drawable = new NotSerialasableDrawable((camera)=>this.avatar.drawHitbox(this.hitbox, camera));
    }
}

class World extends Typeable {
    
    keepTrackOf(point: ReadonlyPoint) {
        this.camera.setPosition(point);
    }
    
    draw(): void {
        this.camera.clear()
        this.drawables.forEach(mob => {
            mob.draw(this.camera);
        });
    }

    mobs: Set<Entity>;
    drawables = new Set<Drawable>();
    physics: IPhysics;
    controller: Controller;
    materials: ResourceManager<physicalMaterial>;

    constructor(physics: IPhysics, private camera: Camera, controllerMaker: (world: World)=>Controller) {
        super("World");
        this.mobs = new Set<Entity>();
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
        this.mobs.add(entity);
        entity.addDeathListener(entity => this.mobs.delete(entity));
        this.pushDrawable(entity);
    }

    createEntity({avatar, controllerType, body:{hitbox, material, movable = true, velocity}}:
                {avatar: MoveAvatar, controllerType: string, body:{hitbox: Hitbox, material: string, movable: boolean, velocity?: Point}}){
        if(!velocity)
                    velocity = new Point({}); 
        let entity = new Entity(avatar, this.physics.createBody(hitbox, velocity, this.materials.get(material), movable), controllerType);

        this.controller.setControl(entity, controllerType);

        this.pushEntity(entity);
        return entity;
    }

    pushDrawable(drawable: Drawable|DrawableMaker) {
        if(!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.add(drawable)
        drawable.addDeathListener((drawable) =>  this.drawables.delete(drawable));
    }

    pushMaterial(name: string, material: physicalMaterial) {
        this.materials.set(name, material);
    }

    toJSON() {
        return this.mobs;
    }
}