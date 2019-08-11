"use strict";
class Keyboard {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.clone = false;
        window.addEventListener("keydown", (ev) => {
            this.set(ev.code, true);
        });
        window.addEventListener("keyup", (ev) => {
            this.set(ev.code, false);
        });
    }
    set(code, state) {
        switch (code) {
            case 'KeyW':
                this.up = state;
                break;
            case 'KeyS':
                this.down = state;
                break;
            case 'KeyA':
                this.left = state;
                break;
            case 'KeyD':
                this.right = state;
                break;
            case 'Space':
                this.clone = state;
                break;
        }
    }
}

"use strict";
class Mouse {
    constructor(element) {
        this._whell = 0;
        this.position = new Point({});
        this.clicks = new Array(new Array(), new Array(), new Array());
        this.buttons = new Array(false, false, false, false, false);
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
    setPositionByEvent(event) {
        this.position.x = event.offsetX;
        this.position.y = event.offsetY;
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
