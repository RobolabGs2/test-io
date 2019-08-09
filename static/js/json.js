"use strict";
function parseWorld(json) {
    let physics = new Physics();
    let avatarFactory = new AvatarFactory();
    return JSON.parse(json, (key, value) => {
        let _type = value["_type"];
        if (typeof _type === "string") {
            if (key === "avatar") {
                return avatarFactory.make(_type, value);
            }
            switch (_type) {
                case "Point":
                    return new Point(value);
                case "Hitbox":
                    return Hitbox.unpack(value);
                case "Entity":
                    return Entity.unpack(value, physics);
                case "World":
                    return World.unpack(value, physics);
                case "Color":
                    return Color.unpack(value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLFVBQVUsQ0FBQyxJQUFZO0lBQzVCLElBQUksT0FBTyxHQUFhLElBQUksT0FBTyxFQUFFLENBQUM7SUFDdEMsSUFBSSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztJQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBVyxFQUFFLEtBQVUsRUFBRSxFQUFFO1FBQ2hELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUMzQixJQUFHLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQ2pCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDM0M7WUFDRCxRQUFRLEtBQWUsRUFBRTtnQkFDckIsS0FBSyxPQUFPO29CQUNSLE9BQU8sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLEtBQUssUUFBUTtvQkFDVCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLEtBQUssUUFBUTtvQkFDVCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QyxLQUFLLE9BQU87b0JBQ1IsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEMsS0FBSyxPQUFPO29CQUNSLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQztTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQyxDQUFVLENBQUE7QUFDZixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsUUFBZ0IsRUFBRSxLQUE2QjtJQUM5RCxJQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGtCQUFrQixHQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNwRCxHQUFHLENBQUMsa0JBQWtCLEdBQUc7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDOUIsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUM5QyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQyxDQUFBO0lBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQVksRUFBRSxLQUFZO0lBQ3pDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxJQUFZO0lBQzNCLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFXLENBQUMsQ0FBQztBQUM1RCxDQUFDIn0=