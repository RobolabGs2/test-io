"use strict";
class Controller {
    constructor(world) {
        let canvas = document.getElementById('main');
        this.camera = new Camera(canvas);
        this.input = new InputDevices(this.camera);
        this.world = world;
        this.operators = new Array();
    }
    tikc(dt) {
        this.input.tick(dt);
        this.operators.forEach((op) => { op.tick(dt); });
    }
    setControl(entity, type) {
        switch (type) {
            case "nothing": {
                return;
            }
            case "user": {
                this.operators.push(new UserOperator(this, entity));
                return;
            }
            case "bot": {
                this.operators.push(new BotOperator(this, entity));
                return;
            }
        }
    }
}

"use strict";
class BotOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        this.slave.body.jumpSpeed = 100;
    }
    tick(dt) {
        if (this.controller.user && this.controller.user.hitbox.x1 > this.slave.hitbox.x1)
            this.slave.body.runSpeed = 100;
        else
            this.slave.body.runSpeed = -100;
    }
}
class UserOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        let textures = [
            slave.avatar.texture,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];
        this.controller.world.setCamera(this.controller.camera, slave);
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
                hitbox: new Hitbox(slave.hitbox.position.Sum(new Point({ x: 50, y: 0 })), 32, 32),
                controllerType: "nothing",
                material: "stone",
                movable: true
            });
        });
    }
    tick(dt) {
        this.controller.input.tick(dt);
    }
}
