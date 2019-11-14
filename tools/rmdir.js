const fs = require('fs');
const fsHelper = require('./fs-helper.js')

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/directory-or-file");
    process.exit(-1);
}

const path = process.argv[2];
fs.exists(path, (exists) => {
    if (exists) {
        try {
            fsHelper.dfs(path,
                (file) => {
                    fs.unlinkSync(file);
                    console.info(`\x1b[31m${file}\x1b[37m`)
                },
                (dir) => {
                    if (dir === path)
                        return
                    fs.rmdirSync(dir)
                    console.info(`\x1b[31m${dir}\x1b[37m`)
                });
        } catch (e) {
            console.info(e.message);
        }
    }
})
