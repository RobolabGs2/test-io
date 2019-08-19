
interface ImpactBody{
    
    velocity: Point;
    movable: boolean;
    runSpeed: number;
    jumpSpeed: number;
    material: physicalMaterial
    mass: number;
}

class impact{

    private static mean(a: number, b: number){
        return Math.sqrt(a * b);
    }

    static hit(body1: ImpactBody, body2: ImpactBody, vector: Point){
        let m1 = body1.mass;
        let m2 = body2.mass;

        if(Math.abs(vector.x) >= Math.abs(vector.y)){

            let vel = this.bounce(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable, 
                this.mean(body1.material.elasticityCoefficient, body2.material.elasticityCoefficient));
            body1.velocity.x = vel.v;
            body2.velocity.x = vel.u;    

            let fric = this.friction(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable, 
                this.mean(body1.material.frictionСoefficient, body2.material.frictionСoefficient));
            body1.velocity.y = fric.v;
            body2.velocity.y = fric.u;    
        }else{
            
            let vel = this.jump(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable, 
                this.mean(body1.material.elasticityCoefficient, body2.material.elasticityCoefficient),
                body1.jumpSpeed, body2.jumpSpeed);
            
            body1.velocity.y = vel.v;
            body2.velocity.y = vel.u;   
            
            let fric = this.run(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable, 
                this.mean(body1.material.frictionСoefficient, body2.material.frictionСoefficient),
                body2.runSpeed - body1.runSpeed);
            body1.velocity.x = fric.v;
            body2.velocity.x = fric.u;    
        }
    }

    private static bounce(v: number, u: number, m1: number, m2: number, mov1: boolean, mov2: boolean, k:number): {v: number, u: number}{
        
        let u1 = u - v;
        let p = 20 * Math.min(m1, m2);
        let root = 1 - k + p * (m1 + m2) / (m1 * m2 * u1 * u1);
        let mult = Math.sqrt(root);

        if (mov1 && mov2){
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);

            u = v + u2;
            v = v + v2;
        }else 
        if (mov1){
            
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }else 
        if (mov2){

            let u2 = -u1 * mult;
            u = v + u2;
        }
        return {v: v, u: u};
    }

    private static friction(v: number, u: number, m1: number, m2: number, mov1: boolean, mov2: boolean, k: number): {v: number, u: number}{
       
        let u1 = u - v;

        let root = 1 - k;
        let mult = - Math.sqrt(root);

        if (mov1 && mov2)
        {
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);

            u = v + u2;
            v = v + v2;
        }else
        if (mov1){
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }else
        if (mov2){
            let u2 = -u1 * mult;
            u = v + u2;
        }
        return {v: v, u: u};
    }

    private static run(v: number, u: number, m1: number, m2: number, mov1: boolean, mov2: boolean, k: number, S: number): {v: number, u: number}{
        
        let u1 = u - v;

        let root = 1 - k;
        let mult = Math.sqrt(root);

        if (mov1 && mov2)
        {
            let u2 = (u1 * (m2 + m1 * mult) + m1 * S * (1 - mult)) / (m2 + m1);
            let v2 = m2 * (u1 - S) * (1 - mult) / (m2 + m1);

            u = v + u2;
            v = v + v2;
        }else
        if (mov1){
            let u2 = u1;
            let v2 = (u1 - S) * (1 - mult);

            u = v + u2;
            v = v + v2;
        }else
        if (mov2){
            let u2 = u1 * mult + S * (1 - mult);
            let v2 = 0;

            u = v + u2;
            v = v + v2;
        }
        return {v: v, u: u};
    }

    private static jump(v: number, u: number, m1: number, m2: number, mov1: boolean, mov2: boolean, k: number, jvel1: number, jvel2: number): {v: number, u: number}{
        
        let u1 = u - v;
        let p = 20 * Math.min(m1, m2) + m1 * jvel1 * jvel1 + m2 * jvel2 * jvel2;
        let root = 1 - k + p * (m1 + m2) / (m1 * m2 * u1 * u1);
        let mult = Math.sqrt(root);
        
        if (mov1 && mov2){
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);

            u = v + u2;
            v = v + v2;
        }else 
        if (mov1){
            
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }else 
        if (mov2){

            let u2 = -u1 * mult;
            u = v + u2;
        }
        
        return {v: v, u: u};
    }
}