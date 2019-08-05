
class PriorityQueue{
    
    list: Array<Entity>;

    constructor(){
        this.list = new Array<Entity>();
    }

    Add(entity: Entity){
        entity.tag = this.list.length;
        this.list.push(entity);
        this.Up(entity.tag);
    }

    private Up(i: number){
        let prev = this.Prev(i);
        while (i > 0 && this.list[i].collision.time < this.list[prev].collision.time)
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

        if (this.Valid(left) && this.list[left].collision.time < this.list[min].collision.time)
            min = left;
        if (this.Valid(right) && this.list[right].collision.time < this.list[min].collision.time)
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