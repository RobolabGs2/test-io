class Buffer<T> {
    buf = new Array<T>();
    
    push(elem: T) {
        this.buf.push(elem);
    }

    get size() {
        return this.buf.length;
    }

    get empty() {
        return this.buf.length == 0;
    }

    flush() {
        let b = this.buf;
        this.buf = new Array<T>();
        return b;
    }
}