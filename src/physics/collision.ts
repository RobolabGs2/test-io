class Collision{
    
    static EntityesTime(e1: Entity, e2: Entity, time: number): number{

        let sq1 = e1.hitbox;
        let sq2 = e2.hitbox;
        let dV = e2.velocity.Sum(e1.velocity.Neg());
        let dg = e2.Acceleration().Sum(e1.Acceleration().Neg());

        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, dV, dg, time);
        dV = dV.Revers();
        dg = dg.Revers();
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, dV, dg, time);

        return time;
    }

    private static LinesTime(x: number, y1: number, y2: number, a: number, b1: number, b2: number, dV: Point, dg: Point, time: number): number{
        let dx = a - x;
        if (dg.x == 0)
        {
            if (dV.x == 0)
                time;
            let t = - dx / dV.x;
            if(t > 0 && t < time)
            {
                let b12 = this.Move(b1, dV.y, dg.y, t);
                let b22 = this.Move(b2, dV.y, dg.y, t);

                if (this.CheckLines(y1, y2, b12, b22))
                    time = t;
            }

        }else
        {
            let underSqrt = dV.x * dV.x - 2 * dg.x * dx;
            if (underSqrt < 0)
                return time;
            let sqt = Math.sqrt(underSqrt);
            let t1 = (-dV.x + sqt) / dg.x;
            let t2 = (-dV.x - sqt) / dg.x;
            
            if (t1 > 0 && t1 < time)
            {
                let b12 = this.Move(b1, dV.y, dg.y, t1);
                let b22 = this.Move(b2, dV.y, dg.y, t1);

                if (this.CheckLines(y1, y2, b12, b22))
                    time = t1;
            }

            if (t2 > 0 && t2 < time)
            {
                let b12 = this.Move(b1, dV.y, dg.y, t2);
                let b22 = this.Move(b2, dV.y, dg.y, t2);

                if (this.CheckLines(y1, y2, b12, b22))
                    time = t2;
            }
        }
        return time;
    }

    private static Move(x: number, V: number, g: number,  t: number): number{
        return x + V * t + g * (t * t) / 2;
    }
    
    private static CheckLines(x1: number, x2: number, a1: number, a2: number): boolean{
        return !(x2 < a1 || a2 < x1); 
    }

} 