/**
 * Standalone Keep-Alive Script for Render
 * Usage: node scripts/keep-alive.js https://your-app.onrender.com
 */

const https = require('https');
const http = require('http');

const targetUrl = process.argv[2] || process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';
const healthEndpoint = targetUrl.endsWith('/') ? `${targetUrl}api/health` : `${targetUrl}/api/health`;

console.log(`[Keep-Alive Pinger] Starting monitor for: ${healthEndpoint}`);

function pingServer() {
  const client = healthEndpoint.startsWith('https') ? https : http;
  
  client.get(healthEndpoint, (res) => {
    console.log(`[${new Date().toISOString()}] Ping status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Ping failed: ${err.message}`);
  });
}

// Initial ping
pingServer();

// Ping every 10 minutes (600,000 ms)
const PING_INTERVAL = 10 * 60 * 1000;
setInterval(pingServer, PING_INTERVAL);
