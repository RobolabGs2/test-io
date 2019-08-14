abstract class Typeable {
    _type: string;
    constructor(type: string) {
        this._type = type;
    }
}

type Resource = "materials" | "textures"
type WorldComponent = "entity" | "material"
type json = string

class WorldCreator {
    avatarFactory = new AvatarFactory();
    
    constructor(private camera: Camera, private input: InputDevices) {
    }

    loadJson(worldName: string, component: WorldComponent) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `./static/worlds/${worldName}/${component}.json`, false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status !== 404) {
                console.log(xhr.responseText)
            }
        }
        xhr.send();
        return xhr.responseText;
    }

    loadWorld(worldName: string, start: (world: World) => void) {
        const physics: IPhysics = new Physics();
        const world = new World(physics, this.camera, world => new Controller(this.input, world));
        this.parseResource(this.loadJson(worldName, "material"), world.pushMaterial.bind(world));
        this.parseEntity(this.loadJson(worldName, "entity"), world.createEntity.bind(world));      
        start(world);
    }

    parseResource(json: string, push: (name: string, resourse: any) => void) {
        let resources = JSON.parse(json);
        for (const name in resources) {
            if (resources.hasOwnProperty(name)) {
               push(name, resources[name]);
            }
        }
    }

    parseEntity(json: string, push: (entity: any) => void) {
        return JSON.parse(json, (key: string, value: any) => {
            let _type = value["_type"];
            if (typeof _type === "string") {
                if (key === "avatar") {
                    return this.avatarFactory.make(_type, value);
                }
                switch (_type as string) {
                    case "Point":
                        return new Point(value);
                    case "Hitbox":
                        return Hitbox.unpack(value);
                    case "Color":
                        return Color.unpack(value);
                    case "Entity":
                        push(value);
                        break;
                }
            }
            return value;
        })
    }


    saveLocal(save: string, world: World) {
        let str = JSON.stringify(world, null, " ");
        console.log(str);
        localStorage.setItem(save, str);
    }
/*
    loadLocal(save: string): World {
        return this.parseWorld(localStorage.getItem(save) as string);
    }*/
}