/* eslint-disable no-unused-vars */
const fs = require('fs');
const archiver = require('archiver');

let output = fs.createWriteStream(__dirname + '/dist.zip');

let archiv = archiver('zip', {
    zlib: {level: 9}
});

new Promise((resolve, reject) => {
    archiv.pipe(output);
    archiv.file('./src/chatLogic/chatLogic.js', {name: "chatLogic.js"});
    archiv.directory('./src/chatLogic/lang/', "lang");
    output.on('close', function () {
        resolve(true);
    });
    archiv.finalize();
}).then(r => {
    output = fs.createWriteStream(__dirname + '/demoDist.zip');

    archiv = archiver('zip', {
        zlib: {level: 9}
    });

    archiv.pipe(output);
    archiv.directory('./dist', false);
    archiv.finalize();
})




