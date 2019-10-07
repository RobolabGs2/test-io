const fs = require('fs');
const concat = require('concat');
const fsHelper = require('./fs-helper.js')

function addFile(path, result = []) {
    fsHelper.dfs(path, result.push.bind(result), ()=>{})
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
    console.log("Usage: " + __filename + " path/ts/src path/js/compile path/to");
    process.exit(-1);
}

const src = process.argv[2];
const compile = process.argv[3];
const to = process.argv[4];
const mapSrc2Compile = (x) => x.replace(new RegExp(src+'(.*)\.ts'), compile+'$1.js');
const items = fs.readdirSync(src);
const main = []

const now = new Date()
console.info(`[\x1b[35m${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[37m]`)
console.group()
for (let i = 0; i < items.length; ++i) {
    let item = `${src}/${items[i]}`;
    if(fs.lstatSync(item).isFile()) {
        main.push(mapSrc2Compile(item));
        continue;
    }
    concatWithLogs(addFile(item).map(mapSrc2Compile), `${to}/${items[i]}.js`)
} 
concatWithLogs(main, to+"/main.js")
console.groupEnd()
