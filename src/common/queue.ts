class Queue<T> {
    private first = 1;
    private last = 1;
    private elems = new Array<T>();
    private capacity = Number.MAX_SAFE_INTEGER;
    private _size = 0;
    get size() {
        return this._size;
    }
    
    private inc(a: number, d = 1) {
        return (a+d)%this.capacity;
    }

    enqueue(data: T) {
        this.elems[this.last] = data;
        this.last = this.inc(this.last);
        this._size++;
        if(this._size > this.capacity)
            throw new Error("Queue overflow");
    }
 
    dequeue() {
        let deletedData: T | undefined;
        
        if (this._size > 0) {
            deletedData = this.elems[this.first];
            delete this.elems[this.first];
            this.first = (this.first+1)%this.capacity;
            this._size--;
        }

        return deletedData;
    }
}