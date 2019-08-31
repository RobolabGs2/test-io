interface Operator{
    slave: Entity;
    tick(dt: number): void;
}

class BotOperator implements Operator{
    
    slave: Entity;
    controller: Controller;

    constructor(controller: Controller, slave: Entity){
        this.slave = slave;
        this.controller = controller;
        this.slave.body.jumpSpeed = 100;
    }

    tick(dt: number){
        if(this.controller.user && this.controller.user.hitbox.x1 > this.slave.hitbox.x1)
            this.slave.body.runSpeed = 100;
        else
            this.slave.body.runSpeed = -100;
    }
}

class UserOperator implements Operator{
    
    slave: Entity;
    controller: Controller;

    constructor(controller: Controller, slave: Entity){
        this.slave = slave;
        this.controller = controller;
        let textures = [
            slave.avatar.moveRight,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];
        
        this.controller.world.keepTrackOf(new FakePoint(slave.hitbox.position, new Point({x:slave.hitbox.width/2, y:slave.hitbox.height/2})));
        this.controller.user = slave;
        let speed = 150;
        this.controller.input.addPressAction(Actions.left, (pressed) => {
            slave.body.runSpeed = pressed ? -speed : 0; 
            return true;
        }).addPressAction(Actions.right, (pressed) => {
            slave.body.runSpeed = pressed ? speed : 0;
            return true;
        }).addPressAction(Actions.jump, (pressed) => {
            slave.body.jumpSpeed = pressed ? 150 : 0;
            return true;
        }).addPressAction(Actions.clone, (pressed) => {
            if(pressed)
                return
            this.controller.world.createEntity({
                avatar: new CompositeAvatar(textures[getRandomInt(0, textures.length - 1)]),
                controllerType: "bot",
                body: {
                    hitbox: new Hitbox(slave.hitbox.position.Sum(new Point({ x: slave.hitbox.width+10, y: 0 })), 32, 32),
                    material: "stone",
                    movable: true}
                });
        })

    }

    tick(dt: number){
        
        let textures = [
            new AnimatedFillRectangleTexture(new Color(255, 255, 255)),
            new AnimatedFillRectangleTexture(new Color(0, 255, 0), new Color(0, 0, 255)),
            new AnimatedFillRectangleTexture(new Color(0, 255, 0), new Color(255, 0, 0)),
            new AnimatedFillRectangleTexture(new Color(0, 255, 0), new Color(255, 0, 255)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
        ];

        if (!this.controller.input.mouse.clicks[0].empty) {
            this.controller.input.mouse.clicks[0].flush().forEach(position => {
                
                let pos = new Point({x: this.slave.hitbox.width / 2, y: this.slave.hitbox.height /2}).Sum(this.slave.hitbox.position);
                let vect = position.Sum(pos.Neg());
                vect = vect.SMult(1 / vect.length());

                let t = textures[getRandomInt(0, textures.length - 1)];
                this.controller.world.createEntity({
                    avatar: new CaudateAvatar(new CompositeAvatar(t)),
                    controllerType: "explosion" ,  
                    body: {
                        hitbox: new Hitbox(pos.Sum(vect.SMult(40)).Sum(new Point({x: -5, y: -5})), 10, 10),
                        material: "stone",
                        movable: true,
                        velocity:vect.SMult(200) 
                    }});
            })
        }
    }
}

class RandomTextureOperator implements Operator{
    
    slave: Entity;
    controller: Controller;

    constructor(controller: Controller, slave: Entity){
        this.slave = slave;
        this.controller = controller;
    }

    tick(dt: number){
    }
}
class ExplosionOperator implements Operator{
    
    slave: Entity;
    controller: Controller;

    eventnum: number;

    constructor(controller: Controller, slave: Entity){
        this.slave = slave;
        this.controller = controller;

        this.eventnum = slave.body.addCollisionEvent((
            (_: any) => {
                this.slave.body.removeCollisionEvent(this.eventnum);
                this.slave.die();
                _.die();
                for(let i = 1; i < 6; ++i){
                    let vect = new Point({x: Math.sin(i / 6 * Math.PI + Math.PI / 2), y: -Math.cos(i / 6 * Math.PI - Math.PI / 2)});

                    let t1 = new FillRectangleTexture(new Color(255, 200, 20));
                    let t2 = new StrokeRectangleTexture(new Color(200, 20, 20, 0.25));
                    this.controller.world.createEntity({
                        avatar: new CaudateAvatar(new CompositeAvatar(t1), new CompositeAvatar(t2)),
                        controllerType: "nothing" ,  
                        body: {
                            hitbox: new Hitbox(slave.hitbox.position.Sum(vect.SMult(30)), slave.body.hitbox.width, slave.body.hitbox.height),
                            material: "stone",
                            movable: true,
                            velocity:vect.SMult(100) 
                        }
                    });
                }
            }
        ));

    }

    tick(dt: number){
    }
}