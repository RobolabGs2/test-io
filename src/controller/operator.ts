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
            slave.avatar.texture,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];
        
        this.controller.world.keepTrackOf(slave);
        this.controller.user = slave;
        let speed = 150;
        this.controller.input.addPressAction(true, Actions.left, () => {
            slave.body.runSpeed = -speed; 
            return true;
        }).addPressAction(false, Actions.left, () => {
            slave.body.runSpeed = 0; 
            return true;
        }).addPressAction(true, Actions.right, () => {
            slave.body.runSpeed = speed;
            return true;
        }).addPressAction(false, Actions.right, () => {
            slave.body.runSpeed = 0;
            return true;
        }).addPressAction(true, Actions.jump, () => {
            slave.body.jumpSpeed = 150;
            return true;
        }).addPressAction(false, Actions.jump, () => {
            slave.body.jumpSpeed = 0;
            return true;
        }).addPressAction(false, Actions.clone, () => {
            this.controller.world.createEntity({
                avatar: new CompositeAvatar(textures[getRandomInt(0, textures.length - 1)]),
                controllerType: "random" ,
                body: {
                    hitbox: new Hitbox(slave.hitbox.position.Sum(new Point({ x: 50, y: 0 })), 32, 32),
                    material: "stone",
                    movable: true}
                });
        })

    }

    tick(dt: number){
        
        let textures = [
            this.slave.avatar.texture,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];

        if (!this.controller.input.mouse.clicks[0].empty) {
            this.controller.input.mouse.clicks[0].flush().forEach(position => {
                
                let pos = new Point({x: this.slave.hitbox.width / 2, y: this.slave.hitbox.height /2}).Sum(this.slave.hitbox.position);
                let vect = position.Sum(pos.Neg());
                vect = vect.SMult(1 / vect.length());

                let t = textures[getRandomInt(0, textures.length - 1)];
                this.controller.world.createEntity({
                    avatar: new CompositeAvatar(t),
                    controllerType: "explosion" ,  
                    body: {
                        hitbox: new Hitbox(this.slave.hitbox.position.Sum(vect.SMult(40)), 10, 10),
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

        slave.body.addCollisionEvent((entity => this.slave.avatar = new CompositeAvatar(entity.avatar.texture)))
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
                
                for(let i = 1; i < 6; ++i){
                    let vect = new Point({x: Math.sin(i / 6 * Math.PI + Math.PI / 2), y: -Math.cos(i / 6 * Math.PI - Math.PI / 2)});

                    let t = new FillRectangleTexture(new Color(255, 200, 20, 255));
                    this.controller.world.createEntity({
                        avatar: new CompositeAvatar(t),
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