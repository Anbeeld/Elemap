const hostname = '127.0.0.1';
const portHttp = 8080;

import * as fs from 'fs';
import * as http from 'http';

const server = http.createServer((req, res) => {
  if (req.url === '/js/elemap.js') {
    fs.readFile('./dist/elemap.js', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/javascript');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/js/tilted.js') {
    fs.readFile('./examples/js/tilted.js', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/javascript');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/js/elemap-init.js') {
    fs.readFile('./examples/js/elemap-init.js', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/javascript');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/main.css') {
    fs.readFile('./examples/main.css', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/css');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/tilted') {
    fs.readFile('./examples/tilted.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/rectangle/square') {
    fs.readFile('./examples/rectangle/square.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/rectangle/irregular') {
    fs.readFile('./examples/rectangle/irregular.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/hexagon/pointy/even') {
    fs.readFile('./examples/hexagon/pointy/even.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/hexagon/pointy/odd') {
    fs.readFile('./examples/hexagon/pointy/odd.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/hexagon/flat/even') {
    fs.readFile('./examples/hexagon/flat/even.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/hexagon/flat/odd') {
    fs.readFile('./examples/hexagon/flat/odd.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else if (req.url === '/') {
    fs.readFile('./examples/index.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.end(data);
      }
    });
    return;
  } else {
    res.writeHead(404);
    res.end();
    return;
  }
});

server.listen(portHttp, hostname, () => {
  console.log(`Server running at https://${hostname}:${portHttp}/`);
});