/**
 * Google Business Profile API client.
 * Handles token refresh and post creation.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const CREDS_PATH = 'credentials/gbp-oauth.json';
const TOKENS_PATH = 'credentials/gbp-tokens.json';
const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface GBPPost {
  summary: string;
  callToAction?: {
    actionType: 'LEARN_MORE' | 'BOOK' | 'ORDER' | 'SHOP' | 'SIGN_UP' | 'CALL';
    url?: string;
  };
  media?: {
    mediaFormat: 'PHOTO';
    sourceUrl: string;
  }[];
  topicType: 'STANDARD' | 'OFFER' | 'EVENT';
}

function getCredentials() {
  const creds = JSON.parse(readFileSync(CREDS_PATH, 'utf-8'));
  return creds.installed || creds.web;
}

async function getAccessToken(): Promise<string> {
  if (!existsSync(TOKENS_PATH)) {
    throw new Error('No tokens found. Run: npx tsx scripts/gbp-auth.ts');
  }

  const tokens: Tokens = JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'));
  const { client_id, client_secret } = getCredentials();

  // Refresh the access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id,
      client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  const newTokens = await response.json();

  if (newTokens.error) {
    throw new Error(`Token refresh failed: ${newTokens.error}`);
  }

  // Save updated tokens (keep refresh_token)
  writeFileSync(
    TOKENS_PATH,
    JSON.stringify(
      { ...tokens, access_token: newTokens.access_token, expires_in: newTokens.expires_in },
      null,
      2
    )
  );

  return newTokens.access_token;
}

export async function getAccountAndLocation(): Promise<{ accountName: string; locationName: string }> {
  const token = await getAccessToken();

  // List accounts
  const accountsRes = await fetch(`${GBP_API_BASE}/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const accounts = await accountsRes.json();
  const accountName = accounts.accounts[0].name;

  // List locations
  const locationsRes = await fetch(`${GBP_API_BASE}/${accountName}/locations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const locations = await locationsRes.json();
  const locationName = locations.locations[0].name;

  return { accountName, locationName };
}

export async function createGooglePost(post: GBPPost): Promise<Record<string, unknown>> {
  const token = await getAccessToken();
  const { locationName } = await getAccountAndLocation();

  const response = await fetch(`${GBP_API_BASE}/${locationName}/localPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GBP API error (${response.status}): ${error}`);
  }

  return response.json();
}
