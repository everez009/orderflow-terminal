const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3018;
const DIRECTORY = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Parse URL and remove query strings for file lookup
  let filePath = path.join(DIRECTORY, req.url.split('?')[0]);
  
  // Default to index.html if directory or file doesn't exist
  try {
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch(e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      console.error(`❌ 404: ${filePath}`);
      return;
    }
    
    // Add CORS headers to allow all requests
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.end(data);
    console.log(`✅ 200: ${req.url} (${data.length} bytes)`);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Order Flow Terminal Server running at:`);
  console.log(`   http://localhost:${PORT}/orderflow_1304262038-v4.html`);
  console.log(`   Press Ctrl+C to stop\n`);
});
