// Minimal static server for fixtures/. Listens on all interfaces so that the parent page
// (http://localhost:PORT) and the child frame (http://127.0.0.1:PORT) are cross-origin.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'fixtures');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    const file = path.normalize(path.join(root, urlPath));
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(buf);
    });
  })
  .listen(port, () => console.log(`fixtures server on :${port}`));
