const fs = require('fs');
const archiver = require('archiver');

let output = fs.createWriteStream(__dirname + '/dist.zip');

let archiv = archiver('zip', {
    zlib: {level: 9}
});

archiv.pipe(output);
archiv.file('./src/chatLogic.js', {name: "chatLogic.js"});
archiv.directory('./src/lang/', "lang");
archiv.finalize();




output = fs.createWriteStream(__dirname + '/demoDist.zip');

archiv = archiver('zip', {
    zlib: {level: 9}
});

archiv.pipe(output);
archiv.directory('./dist', false);
archiv.finalize();

