import Redis from 'ioredis';

// Initialize Redis client with Upstash credentials
// Format: rediss://default:PASSWORD@HOST:PORT
const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  console.warn('⚠️  UPSTASH_REDIS_URL not set - Redis features will be disabled');
}

const redis = redisUrl ? new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      console.error('❌ Redis connection failed after 3 retries');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 1000); // Exponential backoff
  }
}) : null;

// Connection error handling
if (redis) {
  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('ready', () => {
    console.log('✅ Redis ready for commands');
  });
}

export default redis;
