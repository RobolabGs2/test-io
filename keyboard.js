"use strict";
class Keyboard {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.clone = false;
    }
    set(code, state) {
        switch (code) {
            case 'KeyW':
                keys.up = state;
                break;
            case 'KeyS':
                keys.down = state;
                break;
            case 'KeyA':
                keys.left = state;
                break;
            case 'KeyD':
                keys.right = state;
                break;
            case 'Space':
                keys.clone = state;
                break;
        }
    }
}
