const fs = require('fs');
const concat = require('concat');

function addFile(path, result = []) {
    if(fs.lstatSync(path).isFile()) {
        result.push(path)
        return result;
    }

    let items = fs.readdirSync(path);
    for (let i = 0; i<items.length; ++i) {
        addFile(`${path}/${items[i]}`, result);
    }    
    return result;
}

function concatWithLogs(files, out) {
    console.group(`\x1b[36m${out}\x1b[37m`)
    console.info(files)
    console.groupEnd()
    console.info()
    concat(files, out);
}

if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/from/directory path/to");
    process.exit(-1);
}
 
const src = process.argv[2];
const to = process.argv[3];
let items = fs.readdirSync(src);
let main = []
console.clear()
const now = new Date()
console.info(`[\x1b[35m${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[37m]`)
console.group()
for (let i = 0; i<items.length; ++i) {
    let item = `${src}/${items[i]}`;
    if(fs.lstatSync(item).isFile()) {
        main.push(item);
        continue;
    }
    concatWithLogs(addFile(item), `${to}/${items[i]}.js`)
} 
concatWithLogs(main, to+"/main.js")
console.groupEnd()
