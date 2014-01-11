var http = require('http');
var pid = require('./helpers').pid;

pid.make();

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');