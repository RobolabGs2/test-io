function b2i(b: boolean) {
    return b ? 1:0;
}

function i2b(i: number) {
    return i!=0;
}

class Keyboard {
    keys = new Map<string, boolean>()
    buffer = new Array<Buffer<string>>(new Buffer<string>(), new Buffer<string>());
    set(code: string, state: boolean) { 
        this.keys.set(code, state)
        this.buffer[b2i(state)].push(code);
    }

    getBuferOfKeys(press: boolean) {
        return this.buffer[b2i(press)].flush();
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