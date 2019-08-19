interface ChunkTableNode<T>{
    rectangle: Rectangle ;
    r: ReadonlyHitbox;
    value: T;
}

interface Rectangle
{
    X1: number;
    Y1: number;
    X2: number;
    Y2: number;
}

class HashMap<V>{
    
    private map: Map<number, Map<number, V>>;
    size: number;

    constructor(){
        this.map = new  Map<number, Map<number, V>>(); 
        this.size = 0;
    }

    set(p: Point, v: V): void{
        
        let under = this.map.get(p.x)
        
        if(!under){
            under = new Map<number, V>();
            this.map.set(p.x, under);
        }
        ++this.size;
        under.set(p.y, v);
    }

    get(p: Point): V | undefined{

        let under = this.map.get(p.x);
        if(!under)
            return undefined;
        return under.get(p.y);
    }
    
    has(p: Point): boolean{
        
        let under = this.map.get(p.x);
        if(!under)
            return false;
        return under.has(p.y);
    }

    delete(p: Point): boolean{

        let under = this.map.get(p.x);
        if(!under)
            return false;
        
        let ret = under.delete(p.y);
        
        if(under.size == 0)
            this.map.delete(p.x);
        
        if(ret)
            --this.size;
        return ret;
    }

    forEach(pred: (value: V, key: Point) => void): void{

        this.map.forEach((value1: Map<number, V>, key1: number) => 
            value1.forEach((value2: V, key2: number) => 
                pred(value2, new Point({x: key1, y: key2}))));
    }
}

class ChunkTable<T>{
    elems: Map<T, ChunkTableNode<T>>;
    table: HashMap<Array<ChunkTableNode<T>>>;
    validTable: HashMap<Array<ChunkTableNode<T>>>;
    func: (elem: T, dt: number) => ReadonlyHitbox;
    chunkSize: Point;
    
    constructor(func: (elem: T, dt: number) => ReadonlyHitbox, chunkSize: Point){
        this.chunkSize = chunkSize;
        this.func = func;
        this.elems = new Map<T, ChunkTableNode<T>>();
        this.table = new HashMap<Array<ChunkTableNode<T>>>();
        this.validTable = new HashMap<Array<ChunkTableNode<T>>>();
    }
    
    Add(value: T, dt: number): void{

        var rect = this.GetRctangle(value, dt);
        let node = {rectangle: rect.rectangle, r: rect.r, value: value};
        this.elems.set(value, node);

        for (let i = node.rectangle.X1; i <= node.rectangle.X2; ++i)
            for (let j = node.rectangle.Y1; j <= node.rectangle.Y2; ++j)
                this.AddFromKey(new Point({x: i, y: j}), node);
    }

    Remove(value: T): boolean{

        let node = this.elems.get(value);
        if (!node)
            return false;
        
        this.elems.delete(value);
        for (let i = node.rectangle.X1; i <= node.rectangle.X2; ++i)
            for (let j = node.rectangle.Y1; j <= node.rectangle.Y2; ++j)
                this.RemoveFromKey(new Point({x: i, y: j}), node);
        return true;
    }

    Update(value: T, dt: number){

        let node = this.elems.get(value);
        if(node)
            this.MoveNode(node, dt);
    }

    private GetRctangle(value: T, dt: number){

        let rect = this.func(value, dt);
        return {rectangle: this.Scale(rect), r: rect};
    }

    private Scale(rectangle: ReadonlyHitbox){

        return {
            X1: Math.floor(rectangle.x1 / this.chunkSize.x),
            Y1: Math.floor(rectangle.y1 / this.chunkSize.y),
            X2: Math.floor(rectangle.x2 / this.chunkSize.x),
            Y2: Math.floor(rectangle.y2 / this.chunkSize.y),
        } as Rectangle;
    }

    private MoveNode(node: ChunkTableNode<T>, dt: number): void 
    {
        var rect = this.GetRctangle(node.value, dt);

        let newR = rect.rectangle;
        let lastR = node.rectangle;

        node.rectangle = newR;
        node.r = rect.r;
        
        if (newR.X1 == lastR.X1 &&
            newR.X2 == lastR.X2 &&
            newR.Y1 == lastR.Y1 &&
            newR.Y2 == lastR.Y2)
            return;

        for (let i = lastR.X1; i <= lastR.X2; ++i)
            if (i < newR.X1 || i > newR.X2)
                for (let j = lastR.Y1; j <= lastR.Y2; ++j)
                    this.RemoveFromKey(new Point({x: i, y: j}), node);

        for (let j = lastR.Y1; j <= lastR.Y2; ++j)
            if (j < newR.Y1 || j > newR.Y2)
                for (let i = lastR.X1; i <= lastR.X2; ++i)
                    if (!(i < newR.X1 || i > newR.X2))
                        this.RemoveFromKey(new Point({x: i, y: j}), node);
        
        for (let i = newR.X1; i <= newR.X2; ++i)
            if (i < lastR.X1 || i > lastR.X2)
                for (let j = newR.Y1; j <= newR.Y2; ++j)
                    this.AddFromKey(new Point({x: i,y: j}), node);

        for (let j = newR.Y1; j <= newR.Y2; ++j)
            if (j < lastR.Y1 || j > lastR.Y2)
                for (let i = newR.X1; i <= newR.X2; ++i)
                    if (!(i < lastR.X1 || i > lastR.X2))
                        this.AddFromKey(new Point({x: i, y: j}), node);
    }

    private AddFromKey(key: Point, node: ChunkTableNode<T>){
        let nodes = this.table.get(key);
        if (!nodes){
            nodes = new Array<ChunkTableNode<T>>();
            this.table.set(key, nodes);
        }
        
        nodes.push(node);
        if (nodes.length == 2)
            this.validTable.set(key, nodes);
    }

    private RemoveFromKey(key: Point, node: ChunkTableNode<T>){

        let nodes = this.table.get(key);
        if(!nodes) return;

        let nodeIdx = nodes.findIndex(n => n == node);
        nodes.splice(nodeIdx, 1);

        if (nodes.length == 1)
            this.validTable.delete(key);
        if (nodes.length == 0)
            this.table.delete(key);
    }


    Refresh(dt: number): void{

        this.elems.forEach(n => this.MoveNode(n, dt));
    }

    private IsCollision(n1: ChunkTableNode<T>,  n2: ChunkTableNode<T>): boolean{
        return !(
            n1.r.x2 < n2.r.x1 ||
            n2.r.x2 < n1.r.x1 ||
            n1.r.y2 < n2.r.y1 ||
            n2.r.y2 < n1.r.y1);
    }

    forEachCollisions(pred: (v1: T, v2: T) => void){
/*
        this.elems.forEach((value1: ChunkTableNode<T>, key1: T) =>{
            let f = false;
            
            this.elems.forEach((value2: ChunkTableNode<T>, key2: T) =>{
                if(key1 == key2){
                    f = true;
                    return;
                }
                if(!f) return;

                pred(key1, key2);
            });
        });*/

        
        
        this.table.forEach((value: Array<ChunkTableNode<T>>, key: Point) =>{

            for(let i = 0; i < value.length; ++i)
                for(let j = i + 1; j < value.length; ++j){

                    let node1 = value[i];
                    let node2 = value[j];
                    if (node1 != node2
                        && !((node1.rectangle.X1 < key.x && node2.rectangle.X1 < key.x) || (node1.rectangle.Y1 < key.y && node2.rectangle.Y1 < key.y))
                        && this.IsCollision(node1, node2))
                        pred(node1.value, node2.value);
                }
        });
    }

    forEachCollisionsWith(t: T, pred: (v2: T) => void){
/*
            this.elems.forEach((value2: ChunkTableNode<T>, key2: T) =>{
                if(t == key2)
                    return;
                pred(t, key2);
            });*/

        
        let node = this.elems.get(t);
        if(!node)
            return;

        let node1 = node;
        let start_i = node1.rectangle.X1;
        let start_j = node1.rectangle.Y1;

        for (let i = start_i; i <= node1.rectangle.X2; ++i)
            for (let j = start_j; j <= node1.rectangle.Y2; ++j)
            {
                    let chunk = this.table.get(new Point({x: i, y: j}));
                    if(chunk)
                        chunk.forEach((node2: ChunkTableNode<T>) => 
                        {
                            if(node1 == node2)
                                return;
                            if(i == start_i && j == start_j){
                                if (this.IsCollision(node1, node2))
                                    pred(node2.value);
                            }else
                            if(i == start_i){
                                if (!(node2.rectangle.Y1 < j)
                                    && this.IsCollision(node1, node2))
                                    pred(node2.value);
                            }else
                            if(j == start_j){
                                if (!(node2.rectangle.X1 < i) && this.IsCollision(node1, node2))
                                    pred(node2.value);
                            }else{
                                if (!(node2.rectangle.X1 < i) || (node2.rectangle.Y1 < j)
                                    && this.IsCollision(node1, node2))
                                    pred(node2.value);
                            }
                        });
                    
            }
    }
}
