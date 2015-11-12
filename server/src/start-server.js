'use strict';

let nodeStatic = require('node-static'),
  http = require('http');

let webroot = '.',
  port = findPort();

let fileServer = new(nodeStatic.Server)(webroot);

http.createServer(function(req, res) {
  let eventEmitter;
  if (req.url === '/') {
    eventEmitter = fileServer.serveFile('/index.html', 200, {}, req, res);
  } else {
    eventEmitter = fileServer.serve(req, res);
  }
  eventEmitter.addListener('success', function() {
    console.log(req.url);
  });

  eventEmitter.addListener('error', function (err) {
    console.error('Error serving %s - %s', req.url, err.message);
    res.writeHead(err.status, err.headers);
    res.end();
  });
}).listen(port);

console.log('Ganchrow starter running at http://localhost:%d', port);

function findPort() {
  let args = process.argv, port;
  for(let i = 0; i < args.length; i++) {
    if (args[i] === '--port' || args[i] === '-p') {
      port = Number.parseInt(args[i+1]);
    }
  }
  return port || 8080;
}