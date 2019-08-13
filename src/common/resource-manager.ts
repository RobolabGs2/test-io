class ResourceManager<Resource> {
    resources = new Map<string, Resource>();

    set(name: string, resource: Resource) {
        (resource as any).toJSON = () => {return name;};
        this.resources.set(name, resource);
    }

    get(name: string) {
        let res = this.resources.get(name);
        if(!res)
            throw new Error(`Ресурс ${name} отсутствует!`);
        return res;
    }
}
