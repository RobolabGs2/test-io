abstract class Typeable {
    _type: string;
    constructor(type: string) {
        this._type = type;
    }
}

function parseWorld(json: string) {
    let physics: IPhysics = new Physics();
    let world = new World(physics);
    let avatarFactory = new AvatarFactory();
    JSON.parse(json, (key: string, value: any) => {
        let _type = value["_type"];
        if (typeof _type === "string") {
            if(key === "avatar") {
                return avatarFactory.make(_type, value);
            }
            switch (_type as string) {
                case "Point":
                    return new Point(value);
                case "Hitbox":
                    return Hitbox.unpack(value);
                case "Entity":
                    return world.createEntity(value);
                case "Color":
                    return Color.unpack(value);
            }
        }
        return value;
    })
    return world;
}

function loadWorld(filename: string, start: (world: World) => void) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./static/worlds/"+filename, false);
    xhr.onreadystatechange = function () {
        console.log(this.responseText)
        if (this.readyState === 4 && this.status !== 404) {
            start(parseWorld(this.responseText));
        }
    }
    xhr.send();
}

function saveLocal(save: string, world: World) {
    let str = JSON.stringify(world, null, "  ");
    console.log(str);
    localStorage.setItem(save, str);
}

function loadLocal(save: string) : World {
    return parseWorld(localStorage.getItem(save) as string);
}