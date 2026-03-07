// Dummy Redis client for development
// In production, replace with real Redis client (e.g., @upstash/redis)
const redis = {
  async set(key, value) {
    console.log(`[Redis dummy] SET ${key} ${value}`);
    return 'OK';
  },
  async publish(channel, message) {
    console.log(`[Redis dummy] PUBLISH ${channel} ${message}`);
    return 1;
  },
};

export default redis;