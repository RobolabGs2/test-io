class Controller{
    
    input: InputDevices;
    world: World;
    camera: Camera;
    user?: Entity;
    operators: Array<Operator>;

    constructor(world: World){
        let canvas = document.getElementById('main') as HTMLCanvasElement;
        this.camera = new Camera(canvas);
        this.input = new InputDevices(this.camera);
        this.world = world;
        this.operators = new Array<Operator>();
    }

    tikc(dt: number){
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
        }
    }
}