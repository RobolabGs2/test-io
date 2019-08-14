class Controller{
    
    world: World;
    user?: Entity;
    operators: Array<Operator>;

    constructor(public input: InputDevices, world: World){
        this.world = world;
        this.operators = new Array<Operator>();
    }

    tick(dt: number){
        this.input.tick(dt);
        this.operators.forEach((op) => {op.tick(dt)});
    }   

    setControl(entity: Entity, type: string){
        switch(type){
            case "nothing":{
                return;
            }
            case "user":{
                this.operators.push(new UserOperator(this, entity));
                return;
            }
            case "bot":{
                this.operators.push(new BotOperator(this, entity));
                return;
            }
            case "random":{
                this.operators.push(new RandomTextureOperator(this, entity));
                return;
            }
            case "explosion":{
                this.operators.push(new ExplosionOperator(this, entity));
                return;
            }
        }
    }
}