const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
const port = process.env.PORT || 3002;
const app = next({ dev, hostname: 'localhost', port: port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    console.log('pathname', pathname);
    if (pathname === '/health/liveness') {
      res.end(JSON.stringify({ status: 'ok' }));
    } else if (pathname === '/health/readiness') {
      res.end(JSON.stringify({ status: 'ok' }));
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(` Ready on http://localhost:${port}`);
  });
});
