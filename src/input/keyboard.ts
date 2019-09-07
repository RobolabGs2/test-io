enum KeyState {
    Down = 1,
    Up = 0
}

class Keyboard {
    keys = new Map<string, boolean>()
    buffers = new Array<Buffer<string>>(new Buffer<string>(), new Buffer<string>());

    private set(code: string, state: KeyState) {
        this.keys.set(code, state === KeyState.Down);
        this.buffers[state].push(code);
    }

    private createEventListener(keyState: KeyState) {
        return (ev:KeyboardEvent)=>{
            this.set(ev.code, keyState);
            if(ev.code.startsWith('Key'))
                ev.preventDefault();
        }
    }

    getBufferOfKeys(press: KeyState) {
        return this.buffers[press].flush();
    }

    constructor() {
        window.addEventListener("keydown", this.createEventListener(KeyState.Down));
        window.addEventListener("keyup", this.createEventListener(KeyState.Up));
    }
}