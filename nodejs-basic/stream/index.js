/**
 * TODO:
 * Buatlah program untuk membaca teks input.txt dan menuliskannya ulang pada berkas output.txt
 * menggunakan teknik readable stream dan writable stream.
 */

//Read
const fs = require('fs');

const readableStream = fs.createReadStream('./stream/notes.txt', {
    highWaterMark: 15
});

const writableStream = fs.createWriteStream('./stream/output.txt');

readableStream.on('data', (data) => {
    try {
        process.stdout.write(`[${data}]`);
        writableStream.write(`${data}\n`);
    } catch(error) {
        // catch the error when the chunk cannot be read.
    }
});


