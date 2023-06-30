const express = require('express');
const fs = require('fs');
const app = express();

//Send the index html file when request comes in for /
app.get('/', (req, res)  => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if(!range) {
        res.status(400).send('Requires Range header');
    }

    const videoPath = 'test.mp4';
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const totalContentSize = end - start + 1;
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': totalContentSize,
        'Content-Type': 'video/mp4'
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(5000, () => {
    console.log('Listening on 5000');
})