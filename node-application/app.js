var http = require('http');
var pid = require('./helpers').pid;
var environment = require('./helpers').environment;

pid.make();
environment.init();

if( process.env.NEW_RELIC_ENABLED ){
    var newrelic = require('newrelic');
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(process.env.PORT);
console.log('Server running at http://127.0.0.1:1337/');