import { createClient } from 'redis';

let client;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
      password: process.env.REDIS_PASSWORD,
    });
    client.on('error', () => {}); // silence errors
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const redis = await getRedisClient();
  await redis.incr('Converted to Pdfs');  // bump your counter
  res.status(204).end();                  // no content
}
