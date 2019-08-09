class Keyboard {
    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;
    clone: boolean = false;

    set(code: string, state: boolean) { 
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

    constructor() {
        window.addEventListener("keydown", (ev:KeyboardEvent)=>{
            keys.set(ev.code, true);
        });
        window.addEventListener("keyup", (ev:KeyboardEvent)=>{
            keys.set(ev.code, false);
        });
    }
}