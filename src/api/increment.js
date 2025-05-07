// src/api/increment.js
import { createClient } from 'redis';

let client;

/**
 * Lazily initialize and cache the Redis client across invocations.
 * Vercel may reuse the same lambda instance.
 */
async function getRedisClient() {
  if (!client) {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
      password: process.env.REDIS_PASSWORD,
    });
    // suppress the “unhandled” warning
    client.on('error', () => {});
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const redis = await getRedisClient();
  // Use key “Converted to Pdfs”; initialize to 0 if missing, then INCR
  await redis.incr('Converted to Pdfs');

  // We don’t need to return any JSON—just a 204 No Content
  res.status(204).end();
}
