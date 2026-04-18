import Redis from 'ioredis';

// Initialize Redis client with Upstash credentials
const redis = new Redis(process.env.UPSTASH_REDIS_URL || '');

// Connection error handling
redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

export default redis;
