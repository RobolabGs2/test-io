interface Tagable{
    tag: number;
    readonly time: number;
}

class PriorityQueue<T extends Tagable>{
    
    list: Array<T>;

    get size(){ return this.list.length; };

    constructor(){
        this.list = new Array<T>();
    }

    Add(body: T){
        body.tag = this.list.length;
        this.list.push(body);
        this.Up(body.tag);
    }

    private Up(i: number){
        let prev = this.Prev(i);
        while (i > 0 && this.list[i].time < this.list[prev].time)
        {
            this.Swap(i, prev);
            i = prev;
            prev = this.Prev(i);
        }
    }

    private Left(i: number): number{
        return 2 * i + 1;
    }

    private Right(i: number): number{
        return 2 * i + 2;
    }

    private Prev(i: number): number{
        return Math.floor((i - 1) / 2);
    }

    private Valid(i: number): boolean{
        return i < this.list.length;
    }

    Remove(i: number){
        if(i ==  this.list.length - 1){
            this.list.pop();
            return;    
        }
        this.Swap(i, this.list.length - 1);
        this.list.pop();
        this.Relocate(i);
    }

    clear(){
        this.list = new Array<T>();
    }

    popTop(){
        if(this.list.length == 1){
            this.list.pop();
            return;    
        }
        this.Swap(0, this.list.length - 1);
        this.list.pop();
        this.Heapify(0);
    }

    private Swap(i: number, j: number){
        let buf = this.list[i];
        this.list[i] = this.list[j];
        this.list[j] = buf;

        this.list[i].tag = i;
        this.list[j].tag = j;
    }

    private Heapify(i: number){
        if (!this.Valid(i))
            return;

        let min = i;
        let left = this.Left(i);
        let right = this.Right(i);

        if (this.Valid(left) && this.list[left].time < this.list[min].time)
            min = left;
        if (this.Valid(right) && this.list[right].time < this.list[min].time)
            min = right;
        if (min == i)
            return;

        this.Swap(i, min);
        this.Heapify(min);
    }

    Better(){
        return this.list[0];
    }

    Relocate(i: number){
        this.Up(i);
        this.Heapify(i);
    }
}