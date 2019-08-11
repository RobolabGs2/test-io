"use strict";
var Actions;
(function (Actions) {
    Actions[Actions["wtf"] = 0] = "wtf";
    Actions[Actions["jump"] = 1] = "jump";
    Actions[Actions["left"] = 2] = "left";
    Actions[Actions["right"] = 3] = "right";
    Actions[Actions["up"] = 4] = "up";
    Actions[Actions["down"] = 5] = "down";
    Actions[Actions["clone"] = 6] = "clone";
    Actions[Actions["zoom"] = 7] = "zoom";
    Actions[Actions["unzoom"] = 8] = "unzoom";
    Actions[Actions["COUNT"] = 9] = "COUNT";
})(Actions || (Actions = {}));
class InputDevices {
    constructor(camera) {
        this.pressingActions = new Map();
        this.upActions = new Map();
        this.downActions = new Map();
        this.action2key = new Array(Actions.COUNT);
        this.mouse = new Mouse(camera);
        this.keyboard = new Keyboard();
        this.action2key[Actions.jump] = "Space";
        this.action2key[Actions.right] = "KeyD";
        this.action2key[Actions.left] = "KeyA";
        this.action2key[Actions.down] = "KeyS";
        this.action2key[Actions.clone] = "KeyF";
    }
    get mousePosition() {
        return this.mouse.position;
    }
    get mouseCursore() {
        return this.mouse.getCursore();
    }
    addPressingAction(action, consumer) {
        this.pressingActions.set(action, consumer);
        return this;
    }
    addPressAction(press, action, consumer) {
        if (press)
            this.downActions.set(action, consumer);
        else
            this.upActions.set(action, consumer);
        return this;
    }
    tick(dt) {
        this.action2key.forEach((key, action) => {
            if (this.keyboard.keys.get(key) && this.pressingActions.has(action))
                this.keyboard.keys.set(key, this.pressingActions.get(action)(dt));
        });
        this.keyboard.getBuferOfKeys(true).forEach((key) => {
            let action = this.action2key.indexOf(key);
            if (this.downActions.has(action))
                this.downActions.get(action)();
        });
        let wheel = this.mouse.whell;
        if (this.downActions.has(Actions.zoom))
            for (let i = 0; i < wheel / 100; ++i)
                this.downActions.get(Actions.zoom)();
        if (this.downActions.has(Actions.unzoom))
            for (let i = 0; i < -wheel / 100; ++i)
                this.downActions.get(Actions.unzoom)();
        this.keyboard.getBuferOfKeys(false).forEach((key) => {
            let action = this.action2key.indexOf(key);
            if (this.upActions.has(action))
                this.upActions.get(action)();
        });
    }
}

"use strict";
function b2i(b) {
    return b ? 1 : 0;
}
function i2b(i) {
    return i != 0;
}
class Keyboard {
    constructor() {
        this.keys = new Map();
        this.buffer = new Array(new Buffer(), new Buffer());
        window.addEventListener("keydown", (ev) => {
            this.set(ev.code, true);
        });
        window.addEventListener("keyup", (ev) => {
            this.set(ev.code, false);
        });
    }
    set(code, state) {
        this.keys.set(code, state);
        this.buffer[b2i(state)].push(code);
    }
    getBuferOfKeys(press) {
        return this.buffer[b2i(press)].flush();
    }
}

"use strict";
class Mouse {
    constructor(camera) {
        this.camera = camera;
        this._whell = 0;
        this.position = new Point({});
        this.clicks = new Array(new Buffer(), new Buffer(), new Buffer());
        this.buttons = new Array(false, false, false, false, false);
        let element = camera.mainCanvas;
        element.addEventListener("wheel", (event) => {
            this._whell += event.deltaY;
            event.preventDefault();
        });
        element.addEventListener("mousemove", (event) => {
            this.setPositionByEvent(event);
            event.preventDefault();
        });
        element.addEventListener("mousedown", (event) => {
            this.setButton(event.button, true);
            //event.preventDefault();
        });
        element.addEventListener("mouseup", (event) => {
            this.setButton(event.button, false);
            event.preventDefault();
        });
        element.addEventListener("contextmenu", (event) => {
            this.setPositionByEvent(event);
            this.addClick(2, new Point(this.position));
            event.preventDefault();
        });
        element.addEventListener("click", (event) => {
            this.setPositionByEvent(event);
            this.addClick(0, new Point(this.position));
            event.preventDefault();
        });
        element.addEventListener("dblclick", (event) => {
            event.preventDefault();
        });
    }
    get whell() {
        let c = this._whell;
        this._whell = 0;
        return c;
    }
    get left() {
        return this.buttons[0];
    }
    get center() {
        return this.buttons[1];
    }
    get right() {
        return this.buttons[2];
    }
    getCursore() {
        return new MouseCursore(this.position);
    }
    setPositionByEvent(event) {
        let newPosition = new Point({ x: event.offsetX, y: event.offsetY });
        newPosition = this.camera.canvas2xy(newPosition);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
        //console.log(`${event.offsetX}:${event.offsetY}`)
    }
    setButton(button, state) {
        if (button < this.buttons.length)
            this.buttons[button] = state;
    }
    addClick(button, position) {
        if (button < this.clicks.length)
            this.clicks[button].push(position);
    }
}
class MouseCursore {
    constructor(position) {
        this.position = position;
        this.avatar = new BaseAvatar(new FillRectangleTexture(new Color(0, 255, 255, 0.8)));
        this.draw = this.avatar.bindContext(new Hitbox(this.position, 10, 10));
    }
    draw(camera) {
    }
    set texture(texture) {
        this.avatar.texture = texture;
    }
}
