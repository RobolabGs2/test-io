class RingBuffer<T> {
    private buffer: Array<T>;
    private end = 0;

    private get first() {
        return this.inc(this.end, 1);
    }

    get capacity() {
        return this.buffer.length;
    }

    put(elem: T) {
        this.buffer[this.end] = elem;
        this.end = this.first;
    }

    forEach(action: (elem: T) => void) {
        if(this.buffer[this.end]) {
            for(let i = this.first; i!=this.end; i = this.inc(i, 1))
                action(this.buffer[i]);
            action(this.buffer[this.end]);
            return
        }
        for(let i = 0; i!=this.end; ++i)
            action(this.buffer[i]);
    }

    private inc(a: number, d = 1) {
        return (a+d)%this.capacity;
    }

    constructor(size: number) {
        this.buffer = new Array<T>(size);
    }
}