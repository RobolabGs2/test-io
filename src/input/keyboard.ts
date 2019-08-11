class Keyboard {
    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;
    clone: boolean = false;

    set(code: string, state: boolean) { 
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

    constructor() {
        window.addEventListener("keydown", (ev:KeyboardEvent)=>{
            this.set(ev.code, true);
        });
        window.addEventListener("keyup", (ev:KeyboardEvent)=>{
            this.set(ev.code, false);
        });
    }
}