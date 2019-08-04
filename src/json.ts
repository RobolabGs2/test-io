function parseWorld(json: string) {
    return JSON.parse(json, (key: string, value: any) => {
        let _type = value["_type"];
        if (typeof _type === "string") {
            switch (_type as string) {
                case "Point":
                    return new Point(value);
                case "Hitbox":
                    return Hitbox.unpack(value);
                case "Entity":
                    return Entity.unpack(value);
                case "World":
                    return World.unpack(value);
                case "Color":
                    return Color.unpack(value);
                case "ImageAvatar":
                    return new ImageAvatar(value.filename);
                case "RectangleAvatar":
                    return new RectangleAvatar(value.color);
                case "StrokeRectangleAvatar":
                    return new StrokeRectangleAvatar(value.color);
            }
        }
        return value;
    }) as World
}

function loadWorld(filename: string, start: (world: World) => void) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', filename, false);
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