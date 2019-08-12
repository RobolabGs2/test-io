const fs = require('fs');

module.exports = {
    dfs : function (path, actionFile, actionDir) {
        if(fs.lstatSync(path).isFile()) {
            actionFile(path)
            return;
        }
        let items = fs.readdirSync(path);
        for (let i = 0; i<items.length; ++i) {
            this.dfs(`${path}/${items[i]}`, actionFile, actionDir);
        }
        actionDir(path);    
        return;
    }
}