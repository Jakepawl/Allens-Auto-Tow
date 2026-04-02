/**
 * One-time OAuth flow to get refresh token for Google Business Profile API.
 *
 * Prerequisites:
 *   1. Go to https://console.cloud.google.com/
 *   2. Create project "Allens Auto Tow Website"
 *   3. Enable "Business Profile APIs"
 *   4. Create OAuth 2.0 credentials (Desktop App type)
 *   5. Download credentials JSON → save as credentials/gbp-oauth.json
 *
 * Usage:
 *   npx tsx scripts/gbp-auth.ts
 *
 * Opens browser for consent, saves tokens to credentials/gbp-tokens.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { URL } from 'url';

const SCOPES = ['https://www.googleapis.com/auth/business.manage'];
const REDIRECT_URI = 'http://localhost:3333/callback';
const CREDS_PATH = 'credentials/gbp-oauth.json';
const TOKENS_PATH = 'credentials/gbp-tokens.json';

let creds: { client_id: string; client_secret: string };
try {
  const raw = JSON.parse(readFileSync(CREDS_PATH, 'utf-8'));
  creds = raw.installed || raw.web;
} catch {
  console.error(`\nError: Could not read ${CREDS_PATH}`);
  console.error('Download your OAuth credentials from Google Cloud Console and save them there.\n');
  process.exit(1);
}

const { client_id, client_secret } = creds;

// Step 1: Generate auth URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', client_id);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log(`\nOpen this URL in your browser:\n\n${authUrl.toString()}\n`);

// Step 2: Listen for callback
const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) return;

  const url = new URL(req.url, 'http://localhost:3333');
  const code = url.searchParams.get('code');

  if (!code) {
    res.writeHead(400);
    res.end('Missing code parameter');
    return;
  }

  // Step 3: Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  if (tokens.error) {
    console.error('\nToken exchange error:', tokens);
    res.writeHead(500);
    res.end(`Error: ${tokens.error}`);
  } else {
    writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
    console.log(`\nTokens saved to ${TOKENS_PATH}`);
    console.log(`Refresh token: ${tokens.refresh_token}`);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Success! You can close this tab.</h1>');
  }

  server.close();
});

server.listen(3333, () => {
  console.log('Waiting for OAuth callback on http://localhost:3333/callback ...');
});
