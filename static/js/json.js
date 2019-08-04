"use strict";
function parseWorld(json) {
    return JSON.parse(json, (key, value) => {
        let _type = value["_type"];
        if (typeof _type === "string") {
            switch (_type) {
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
    });
}
function loadWorld(filename, start) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./static/worlds/" + filename, false);
    xhr.onreadystatechange = function () {
        console.log(this.responseText);
        if (this.readyState === 4 && this.status !== 404) {
            start(parseWorld(this.responseText));
        }
    };
    xhr.send();
}
function saveLocal(save, world) {
    let str = JSON.stringify(world, null, "  ");
    console.log(str);
    localStorage.setItem(save, str);
}
function loadLocal(save) {
    return parseWorld(localStorage.getItem(save));
}
