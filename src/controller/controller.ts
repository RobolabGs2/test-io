class Controller{
    
    world: World;
    user?: Entity;
    operators: Array<Operator>;

    constructor(private input: InputDevicesManager, world: World){
        this.world = world;
        this.operators = new Array<Operator>();
    }

    tick(dt: number){

        this.input.tick(dt);
        this.operators.forEach((op) => {op.tick(dt)});
    }   

    releaseOperator(op: Operator){

        let idx = this.operators.findIndex((o: Operator) => o == op);
        this.operators.splice(idx, 1);
    }

    setControl(entity: Entity, type: string){
        
        let operator: Operator;
        switch(type){
            case "nothing":{
                return;
            }
            case "user":{
                operator = new UserOperator(this, entity, this.input.getInputDevice());
                break;
            }
            case "bot":{
                operator = new BotOperator(this, entity);
                break;
            }
            case "random":{
                operator = new RandomTextureOperator(this, entity);
                break;
            }
            case "explosion":{
                operator = new ExplosionOperator(this, entity);
                break;
            }
            case "bullet":{
                operator = new BulletOperator(this, entity);
                break;
            }
            default:{
                return;
            }
        }
        
        entity.addDeathListener((_) =>  this.releaseOperator(operator));
        this.operators.push(operator);
    }
}